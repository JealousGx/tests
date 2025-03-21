"use client";

import { FormField } from "@/types";
import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  fields: FormField[];
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  submitText?: string;
}

export default function Form<T extends FieldValues>({
  fields,
  onSubmit,
  defaultValues,
  submitText = "Submit",
}: FormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <div className="mt-1">
            {field.type === "select" ? (
              <select
                id={field.name}
                {...register(field.name as Path<T>, {
                  required: field.required,
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.name}
                {...register(field.name as Path<T>, {
                  required: field.required,
                })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            )}
            {errors[field.name as keyof T] && (
              <p className="mt-2 text-sm text-red-600">
                {field.label} is required
              </p>
            )}
          </div>
        </div>
      ))}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}
