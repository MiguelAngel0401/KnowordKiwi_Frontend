import { useState, useCallback, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDebounce } from "./useDebounce";
import { BlogPostFormData } from "../schemas";
import { BlogDraft } from "@/types/posts/blog";

type SavingStatus = "idle" | "saving" | "saved";

const DRAFT_KEY = "blogDraft";

const sanitizeContent = (content: string): string => {
  // En un escenario ideal, DOMPurify se configuraría una vez y se importaría.
  // Por simplicidad, lo mantenemos aquí, pero podría ser un módulo de utilidad.
  if (typeof window === "undefined") return content;
  const DOMPurify = require("isomorphic-dompurify");
  const { DOM_PURIFY_CONFIG } = require("../config/dom-purify.config");
  return DOMPurify.sanitize(content, DOM_PURIFY_CONFIG);
};

export const useBlogDraft = (formMethods: UseFormReturn<BlogPostFormData>) => {
  const { getValues, setValue, watch } = formMethods;
  const [savingStatus, setSavingStatus] = useState<SavingStatus>("idle");
  const [loadedDraft, setLoadedDraft] = useState<BlogDraft | null>(null);

  // Cargar borrador al montar
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft: BlogDraft = JSON.parse(savedDraft);
        // Solo cargar y notificar si el borrador tiene contenido significativo (ej. un título)
        if (draft.title.trim()) {
          setValue("title", draft.title);
          setValue("subtitle", draft.subtitle);
          setValue("content", sanitizeContent(draft.content));
          if (draft.quiz) {
            setValue("quiz", draft.quiz);
          }
          setLoadedDraft(draft);
        }
      } catch (e) {
        console.error("Error al cargar el borrador:", e);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [setValue]);

  // Guardar borrador
  const saveDraft = useCallback(() => {
    setSavingStatus("saving");
    const currentValues = getValues();

    // No guardar si no hay al menos un título.
    if (!currentValues.title.trim()) {
      setSavingStatus("idle"); // Reset status
      return;
    }
    const draft: BlogDraft = { ...currentValues, lastSaved: new Date() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setTimeout(() => {
      setSavingStatus("saved");
      setTimeout(() => setSavingStatus("idle"), 2000);
    }, 1000);
  }, [getValues]);

  const debouncedSaveDraft = useDebounce(saveDraft, 1500);

  // Efecto para autoguardado.
  // Usamos el callback de watch para evitar un ciclo de re-renderizado.
  // Este useEffect solo se monta una vez.
  useEffect(() => {
    const subscription = watch(() => debouncedSaveDraft());
    return () => subscription.unsubscribe();
  }, [watch, debouncedSaveDraft]);

  return { savingStatus, saveDraft, loadedDraft };
};
