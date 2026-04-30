"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-6 py-20 text-center">

      <div className="flex items-center gap-3 mb-8">
        <Image src="/icon.svg" alt="DinDin Logo" width={64} height={64} />
        <span className="text-4xl font-bold text-green-800 dark:text-green-300">
          DinDin
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-zinc-800 dark:text-white mb-4 max-w-2xl leading-tight">
        Bem-vindo ao seu controle financeiro pessoal 👋
      </h1>

      <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mb-12 leading-relaxed">
        Com o{" "}
        <span className="text-green-700 dark:text-green-300 font-semibold">
          DinDin
        </span>
        , você registra suas entradas e saídas, acompanha seu saldo em tempo
        real e entende para onde o seu dinheiro está indo — tudo em um só lugar,
        de forma simples e intuitiva.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14 w-full max-w-3xl text-left">
        <div className="rounded-xl p-6 bg-[#d1fae5] dark:bg-zinc-800 shadow-sm">
          <div className="text-2xl mb-3">📥</div>
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
            Registre entradas
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Salário, freelances, rendimentos — anote tudo e veja seu dinheiro
            crescer.
          </p>
        </div>

        <div className="rounded-xl p-6 bg-[#d1fae5] dark:bg-zinc-800 shadow-sm">
          <div className="text-2xl mb-3">📤</div>
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
            Controle saídas
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Contas, compras, assinaturas — saiba exatamente para onde vai cada
            centavo.
          </p>
        </div>

        <div className="rounded-xl p-6 bg-[#d1fae5] dark:bg-zinc-800 shadow-sm">
          <div className="text-2xl mb-3">📊</div>
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
            Acompanhe o saldo
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Visualize o balanço geral em tempo real e tome decisões financeiras
            com confiança.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="
          inline-flex items-center justify-center gap-2
          px-10 py-4
          rounded-lg
          bg-green-700
          hover:bg-green-800
          active:bg-green-900
          text-white font-semibold text-lg
          transition
          focus:outline-none
          focus:ring-2
          focus:ring-green-400
          focus:ring-offset-2
          shadow-md
        "
      >
        Começar agora →
      </Link>
    </div>
  );
}
