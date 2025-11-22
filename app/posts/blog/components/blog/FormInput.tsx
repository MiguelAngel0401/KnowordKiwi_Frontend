import { Input } from "@headlessui/react";
import { Controller, Control, FormState } from "react-hook-form";
import { BlogPostFormData } from "../../schemas";

interface FormInputProps {
  name: keyof BlogPostFormData;
  label: string;
  control: Control<BlogPostFormData>;
  formState: FormState<BlogPostFormData>;
  placeholder: string;
  savingStatus?: "idle" | "saving" | "saved";
  savingStatusText?: { saving: string; saved: string };
}

export default function FormInput({
  name,
  label,
  control,
  formState,
  placeholder,
  savingStatus,
  savingStatusText,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center h-5">
        <label
          htmlFor={`blog-${name}`}
          className="text-sm font-medium text-gray-300"
        >
          {label}
        </label>
        {savingStatus && savingStatus !== "idle" && savingStatusText && (
          <span className="text-xs text-gray-500">
            {savingStatusText[savingStatus as keyof typeof savingStatusText]}
          </span>
        )}
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={`blog-${name}`}
            type="text"
            {...field}
            className={`px-4 py-3 bg-bg-gray border ${formState.errors[name] ? "border-red-400" : "border-gray-700"} rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder={placeholder}
          />
        )}
      />
      {formState.errors[name] && (
        <p className="text-red-400 text-sm mt-1">
          {formState.errors[name].message}
        </p>
      )}
    </div>
  );
}
