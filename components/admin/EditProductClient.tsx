"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { ProductForm } from "./ProductForm";

type Props = {
  action: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
  initial: ComponentProps<typeof ProductForm>["initial"];
};

export function EditProductClient({ action, deleteAction, initial }: Props) {
  const router = useRouter();

  return (
    <ProductForm
      action={action}
      initial={initial}
      submitLabel="SAVE CHANGES"
      onDelete={async () => {
        await deleteAction();
        router.push("/admin/products");
      }}
    />
  );
}
