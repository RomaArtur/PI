import Lead from "../models/Lead.js";

export const obterEventosDoDia = async () => {
  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const mesHoje = hoje.getMonth() + 1;

  const leadsBrutos = await Lead.aggregate([
    {
      $match: {
        $or: [
          {
            $expr: {
              $and: [
                { $eq: [{ $dayOfMonth: "$dataNascimento" }, diaHoje] },
                { $eq: [{ $month: "$dataNascimento" }, mesHoje] },
              ],
            },
          },
          {
            datasComemorativas: {
              $elemMatch: {
                $expr: {
                  $and: [
                    { $eq: [{ $dayOfMonth: "$data" }, diaHoje] },
                    { $eq: [{ $month: "$data" }, mesHoje] },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  ]);

  const leadsProcessados = leadsBrutos.map((lead) => {
    const motivosDeHoje = [];

    if (lead.dataNascimento) {
      const dataNasc = new Date(lead.dataNascimento);
      if (
        dataNasc.getUTCDate() === diaHoje &&
        dataNasc.getUTCMonth() + 1 === mesHoje
      ) {
        motivosDeHoje.push("Aniversário do Cliente");
      }
    }

    if (lead.datasComemorativas && lead.datasComemorativas.length > 0) {
      lead.datasComemorativas.forEach((evento) => {
        if (evento.data) {
          const dataEv = new Date(evento.data);
          if (
            dataEv.getUTCDate() === diaHoje &&
            dataEv.getUTCMonth() + 1 === mesHoje
          ) {
            motivosDeHoje.push(evento.nomeEvento);
          }
        }
      });
    }

    return {
      ...lead,
      eventosDeHoje: motivosDeHoje,
    };
  });

  return leadsProcessados; 
};
