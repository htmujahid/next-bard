import { headers } from 'next/headers';

import { z } from 'zod';

import { UsersList } from '@/components/admin/users-list';
import { Shell } from '@/components/layout/shell';
import { auth } from '@/lib/auth';

const searchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).default(10),
  name: z.string().optional(),
  role: z.string().optional(),
  sort: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        return [{ id: 'createdAt', desc: true }];
      }
    })
    .pipe(z.array(z.object({ id: z.string(), desc: z.boolean() })))
    .default([]),
});

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    perPage: string;
    name: string;
    role: string;
    sort: string;
  }>;
}) {
  const search = await searchParams;
  const { page, perPage, name, role, sort } = searchSchema.parse(search);

  const data = await auth.api.listUsers({
    query: {
      limit: perPage,
      offset: (page - 1) * perPage,
      sortBy: sort[0]?.id,
      sortDirection: sort[0]?.desc ? 'desc' : 'asc',
      searchField: 'name',
      searchOperator: 'contains',
      searchValue: name,
      filterField: 'role',
      filterOperator: 'eq',
      filterValue: role,
    },
    headers: await headers(),
  });

  return (
    <Shell>
      <UsersList
        data={data.users}
        pageCount={Math.ceil(data.total / perPage)}
      />
    </Shell>
  );
}
