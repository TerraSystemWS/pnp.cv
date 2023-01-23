// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  email: string;
};

export default async function submeter(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    // Process a POST request
    // console.log("teste de post");
    // try {
    //   const res = await fetch(`/api/subscrever`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         email: email,
    //     })
    // });
    //   const data = await res.json();
    //   console.log(data);
    // } catch (err) {
    //   console.log(err);
    // }
  } else {
    // Handle any other HTTP method
    res.status(200).json({ email: "sistema de subscriçao do pnp" });
  }
}
