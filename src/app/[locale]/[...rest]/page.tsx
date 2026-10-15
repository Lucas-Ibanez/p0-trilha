import { notFound } from "next/navigation";

/** Qualquer caminho desconhecido dentro de /en ou /pt-br cai no 404 localizado, dentro do layout. */
export default function CatchAll() {
  notFound();
}
