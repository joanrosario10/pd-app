import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { toError, sanitizeFormString, MAX_INPUT_LENGTH } from '../lib/utils'

export type Profile = {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id || !supabase) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (error) throw toError(error)
      if (data) return data as Profile
      // Create profile if missing (e.g. no trigger). updated_at has default.
      const rawName = user.user_metadata?.full_name
      const full_name = typeof rawName === 'string' && rawName.trim() !== ''
        ? sanitizeFormString(rawName, MAX_INPUT_LENGTH.full_name)
        : null
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email ?? null,
          full_name,
          phone: null,
        })
        .select()
        .single()
      if (insertError) throw toError(insertError)
      return inserted as Profile
    },
    enabled: !!user?.id,
  })

  const updateMutation = useMutation({
    mutationFn: async (input: { full_name?: string | null; phone?: string | null }) => {
      if (!user?.id || !supabase) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: input.full_name != null && input.full_name !== ''
            ? sanitizeFormString(input.full_name, MAX_INPUT_LENGTH.full_name)
            : null,
          phone: input.phone != null && input.phone !== ''
            ? sanitizeFormString(input.phone, MAX_INPUT_LENGTH.phone)
            : null,
        })
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw toError(error)
      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
      toast.success('Profile updated')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    },
  })

  return {
    profile,
    isLoading,
    updateProfile: updateMutation.mutateAsync,
    updateLoading: updateMutation.isPending,
    updateError: updateMutation.error,
  }
}
