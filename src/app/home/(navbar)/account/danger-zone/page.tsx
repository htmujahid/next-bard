import { AccountDangerZone } from '@/components/account/account-danger-zone';

export default function DangerZoneLayout() {
  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 p-4">
      <AccountDangerZone />
    </div>
  );
}
