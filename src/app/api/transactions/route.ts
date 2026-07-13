import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "@/app/lib/axios";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  const idAccount = (await cookies()).get("accountId")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Sem autenticação" },
      { status: 401 }
    );
  }

  const { data } = await api.get(
    `/account/${idAccount}/statement`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
    const accountId = cookieStore.get("accountId")?.value;

    if (!token || !accountId) {
      return NextResponse.json(
        { error: "Sem autenticação" },
        { status: 401 }
      );
    }

    const input = await request.json();

    const { data } = await api.post(
      "/account/transaction",
      {
        accountId,
        type: input.type,
        value: input.value,
        from: input.from,
        to: input.to,
        anexo: input.anexo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}