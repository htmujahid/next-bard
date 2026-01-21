'use client';

import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { tasks } from '@/db/schema';
import { CreateTaskSchema } from '@/validators/tasks';

export function TaskFormFields() {
  const form = useFormContext<CreateTaskSchema>();
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Do a kickflip"
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) =>
                  field.onChange(v as CreateTaskSchema['label'])
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Select a label" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {tasks.label.enumValues.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) =>
                  field.onChange(v as CreateTaskSchema['status'])
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {tasks.status.enumValues.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) =>
                  field.onChange(v as CreateTaskSchema['priority'])
                }
              >
                <FormControl>
                  <SelectTrigger className="w-full capitalize">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {tasks.priority.enumValues.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estimatedHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Hours</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter estimated hours"
                  step="0.5"
                  min="0"
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? e.target.valueAsNumber : undefined,
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
