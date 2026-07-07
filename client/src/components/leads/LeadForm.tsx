import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormData } from '../../schemas';
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES } from '../../constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { Lead } from '../../types';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LeadForm = ({ initialData, onSubmit, onCancel, isLoading }: LeadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      company: initialData?.company || '',
      source: initialData?.source || 'Website',
      status: initialData?.status || 'New',
      priority: initialData?.priority || 'Medium',
      followUpDate: initialData?.followUpDate
        ? new Date(initialData.followUpDate).toISOString().split('T')[0]
        : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
        <Input label="Company" error={errors.company?.message} {...register('company')} />
        <Select
          label="Source"
          options={LEAD_SOURCES.map((s) => ({ label: s, value: s }))}
          error={errors.source?.message}
          {...register('source')}
        />
        <Select
          label="Status"
          options={LEAD_STATUSES.map((s) => ({ label: s, value: s }))}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Priority"
          options={LEAD_PRIORITIES.map((p) => ({ label: p, value: p }))}
          error={errors.priority?.message}
          {...register('priority')}
        />
        <Input label="Follow-up Date" type="date" error={errors.followUpDate?.message} {...register('followUpDate')} />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
