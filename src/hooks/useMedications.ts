import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { toError, sanitizeFormString, MAX_INPUT_LENGTH } from '../lib/utils'

export type Medication = {
  id: string
  user_id: string
  name: string
  dosage: string
  frequency: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type MedicationWithTaken = Medication & {
  taken_today: boolean
}

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useMedications() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: medications = [], isLoading } = useQuery({
    queryKey: ['medications', user?.id],
    queryFn: async () => {
      if (!user?.id || !supabase) return []
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw toError(error)
      return (data ?? []) as Medication[]
    },
    enabled: !!user?.id,
  })

  const addMutation = useMutation({
    mutationFn: async (input: { name: string; dosage: string; frequency?: string | null; notes?: string | null }) => {
      if (!user?.id) throw new Error('Not authenticated')
      if (!supabase) throw new Error('Supabase not configured')
      const { data, error } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: sanitizeFormString(input.name, MAX_INPUT_LENGTH.name),
          dosage: sanitizeFormString(input.dosage, MAX_INPUT_LENGTH.dosage),
          frequency: input.frequency ? sanitizeFormString(input.frequency, MAX_INPUT_LENGTH.frequency) : null,
          notes: input.notes ? sanitizeFormString(input.notes, MAX_INPUT_LENGTH.notes) : null,
        })
        .select()
        .single()
      if (error) throw toError(error)
      return data as Medication
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['medications-today', user?.id] })
      toast.success('Medication added')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to add medication')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) return
      await supabase.from('medication_logs').delete().eq('medication_id', id)
      const { error } = await supabase.from('medications').delete().eq('id', id)
      if (error) throw toError(error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['medications-today', user?.id] })
      toast.success('Medication removed')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to remove')
    },
  })

  return {
    medications,
    isLoading,
    addMedication: addMutation.mutateAsync,
    addLoading: addMutation.isPending,
    deleteMedication: deleteMutation.mutateAsync,
    deleteLoading: deleteMutation.isPending,
  }
}

export function useMedicationsToday() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const today = getTodayDateString()

  const { data: list = [], isLoading, isError, error } = useQuery({
    queryKey: ['medications-today', user?.id, today],
    queryFn: async () => {
      if (!user?.id || !supabase) return []
      const { data: meds, error: medsError } = await supabase
        .from('medications')
        .select('id, user_id, name, dosage, frequency, notes, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (medsError) throw toError(medsError)

      const { data: logs, error: logsError } = await supabase
        .from('medication_logs')
        .select('medication_id')
        .eq('date', today)
      if (logsError) throw toError(logsError)

      const takenIds = new Set((logs ?? []).map((l) => l.medication_id))
      return (meds ?? []).map((m) => ({
        ...m,
        taken_today: takenIds.has(m.id),
      })) as MedicationWithTaken[]
    },
    enabled: !!user?.id,
    retry: 1,
  })

  const queryKey = ['medications-today', user?.id, today] as const

  const markTakenMutation = useMutation({
    mutationFn: async (medicationId: string) => {
      if (!supabase || !user?.id) throw new Error('Not authenticated')
      const { error } = await supabase.from('medication_logs').insert({
        medication_id: medicationId,
        date: today,
        user_id: user.id,
      })
      if (error) throw toError(error)
    },
    onSuccess: () => {
      toast.success('Marked as taken')
    },
    onMutate: async (medicationId: string) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData<MedicationWithTaken[]>(queryKey)
      queryClient.setQueryData<MedicationWithTaken[]>(queryKey, (old = []) =>
        old.map((m) => (m.id === medicationId ? { ...m, taken_today: true } : m))
      )
      return { prev }
    },
    onError: (err, _id, context) => {
      if (context?.prev) queryClient.setQueryData(queryKey, context.prev)
      toast.error(err instanceof Error ? err.message : 'Couldn’t mark as taken')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['calendar-logs'] })
    },
  })

  const markTaken = (medicationId: string) => markTakenMutation.mutate(medicationId)

  return {
    medicationsToday: list,
    isLoading,
    isError,
    error,
    markTaken,
    markLoadingId: markTakenMutation.isPending && markTakenMutation.variables != null ? markTakenMutation.variables : null,
    markTakenError: markTakenMutation.error,
  }
}

export function useCalendarLogs(year: number, month: number) {
  const { user } = useAuth()
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const { data: medList = [] } = useQuery({
    queryKey: ['medications-ids', user?.id],
    queryFn: async () => {
      if (!user?.id || !supabase) return []
      const { data, error } = await supabase
        .from('medications')
        .select('id')
        .eq('user_id', user.id)
      if (error) throw toError(error)
      return (data ?? []) as { id: string }[]
    },
    enabled: !!user?.id,
  })
  const medIds = medList.map((m) => m.id)

  const { data: logs = [] } = useQuery({
    queryKey: ['calendar-logs', user?.id, start, end],
    queryFn: async () => {
      if (!user?.id || !supabase || medIds.length === 0) return []
      const { data, error } = await supabase
        .from('medication_logs')
        .select('date')
        .in('medication_id', medIds)
        .gte('date', start)
        .lte('date', end)
      if (error) throw toError(error)
      return (data ?? []) as { date: string }[]
    },
    enabled: !!user?.id && medIds.length > 0,
  })

  const takenDates = new Set(logs.map((l) => l.date))
  return { takenDates }
}

/** Last 4 weeks adherence for progress chart (Profile) */
export function useAdherenceProgress() {
  const { user } = useAuth()
  const today = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 27) // 28 days including today
  const start = toDateStr(startDate)
  const end = toDateStr(today)

  const { data: medList = [] } = useQuery({
    queryKey: ['medications-ids', user?.id],
    queryFn: async () => {
      if (!user?.id || !supabase) return []
      const { data, error } = await supabase
        .from('medications')
        .select('id')
        .eq('user_id', user.id)
      if (error) throw toError(error)
      return (data ?? []) as { id: string }[]
    },
    enabled: !!user?.id,
  })
  const medIds = medList.map((m) => m.id)

  const { data: logs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['adherence-progress', user?.id, start, end],
    queryFn: async () => {
      if (!user?.id || !supabase || medIds.length === 0) return []
      const { data, error } = await supabase
        .from('medication_logs')
        .select('date')
        .in('medication_id', medIds)
        .gte('date', start)
        .lte('date', end)
      if (error) throw toError(error)
      return (data ?? []) as { date: string }[]
    },
    enabled: !!user?.id && medIds.length > 0,
  })

  const takenDates = new Set(logs.map((l) => l.date))
  const weeks: { label: string; taken: number; total: number; rate: number }[] = []
  for (let w = 0; w < 4; w++) {
    const weekStart = new Date(startDate)
    weekStart.setDate(weekStart.getDate() + w * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    let total = 0
    let taken = 0
    for (let d = new Date(weekStart); d <= weekEnd && d <= today; d.setDate(d.getDate() + 1)) {
      const ds = toDateStr(d)
      total++
      if (takenDates.has(ds)) taken++
    }
    const label = `W${w + 1}`
    weeks.push({ label, taken, total, rate: total > 0 ? Math.round((taken / total) * 100) : 0 })
  }
  return { weekly: weeks, isLoading: logsLoading }
}
