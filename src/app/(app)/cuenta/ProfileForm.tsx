"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateAccount } from "./actions";
import AvatarUpload from "./AvatarUpload";
import { Field, Input, Textarea, Button } from "../ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button variant="primary" disabled={pending}>
      {pending ? "Guardando…" : "Guardar"}
    </Button>
  );
}

export default function ProfileForm({
  fullName,
  avatarUrl,
  bio,
}: {
  fullName: string;
  avatarUrl: string | null;
  bio: string;
}) {
  const [error, formAction] = useActionState(updateAccount, null);

  return (
    <form action={formAction} className="space-y-4">
      <AvatarUpload initialUrl={avatarUrl} />
      <Field label="Nombre completo">
        <Input name="full_name" defaultValue={fullName} required />
      </Field>
      <Field label="Sobre mí (opcional)">
        <Textarea name="bio" rows={3} defaultValue={bio} placeholder="Un par de líneas sobre ti…" />
      </Field>

      {error && <p className="text-xs text-bad-text">{error}</p>}

      <Submit />
    </form>
  );
}
