import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleHelp,
  CircleIcon,
  CircleX,
  Timer,
} from 'lucide-react';

import { type Task } from '@/db/schema';

export function getStatusIcon(status: Task['status']) {
  const statusIcons = {
    canceled: CircleX,
    done: CheckCircle2,
    'in-progress': Timer,
    todo: CircleHelp,
  };

  return statusIcons[status] || CircleIcon;
}

export function getPriorityIcon(priority: Task['priority']) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  };

  return priorityIcons[priority] || CircleIcon;
}
