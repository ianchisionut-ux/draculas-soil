import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";

export default function AdminPasswordSettingsPage() {
  return (
    <div className="max-w-md">
      <h1 className="font-display text-4xl">Change password</h1>
      <p className="mt-2 text-sm text-stone">
        We recommend a unique password, at least 8 characters, used only for this site.
      </p>
      <PasswordChangeForm />
    </div>
  );
}
