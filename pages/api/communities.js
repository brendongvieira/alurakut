import { SiteClient } from "datocms-client";

export default async function requestsReceiver(request, response) {
  if (request.method === "POST") {
    const TOKEN = "336b2bc53a729696743bcc442a89c9";
    const client = new SiteClient(TOKEN);

    //Validate the data, before register
    const createdRegister = await client.items.create({
      itemType: "967640",
      ...request.body,
      //   title: "Comunidade de Teste",
      //   imageUrl: "https://github.com/brendongvieira.png",
      //   creatorSlug: "brendongvieira",
    });

    console.log(createdRegister);

    response.json({
      datas: "Algum dado",
      createdRegister: createdRegister,
    });
    return;
  }

  response.status(404).json({
    message: "Ainda nada!",
  });
}
