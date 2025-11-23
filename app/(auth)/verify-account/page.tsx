"use client";
import { Button } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto p-6 bg-bg-gray rounded-lg shadow-lg text-center text-white">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        ¡Revisa tu correo!
      </h1>
      <Image
        src="/email.svg"
        alt="Email"
        width={100}
        height={100}
        className="mx-auto my-6"
      />
      <p className="text-gray-900 leading-relaxed">
        Te hemos enviado un enlace para verificar tu cuenta. Si no ves el
        correo, revisa tu carpeta de spam.
      </p>
      <div className="flex justify-between gap-4 pt-4 mt-8">
        <Button className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200">
          Reenviar
        </Button>
        <Button
          onClick={() => router.push("/login")}
          className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-200"
        >
          ¡Lo he recibido!
        </Button>
      </div>
    </div>
  );
}
