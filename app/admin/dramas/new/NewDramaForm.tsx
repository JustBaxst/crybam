"use client";

import { DramaForm } from "@/app/dramas/[id]/DramaForm";
import { createDrama } from "../../actions";

export function NewDramaForm() {
  return <DramaForm action={createDrama} />;
}
