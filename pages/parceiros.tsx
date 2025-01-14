import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import { getStrapiMedia } from "../lib/utils"
import HeroSection from "../components/HeroSection"

type Partner = {
  id: number
  link: string | null
  title: string
  foto: string
  tipo: string | null
  cor: string
  icon: string
}

type ParceirosProps = {
  social: any
  contato: any
  parceiros: any
  navbar: any
}

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// Helper to process partner data
const processPartners = (data: any, category: string): Partner[] => {
  return data
    .flatMap((value: any) => value.attributes[category] ?? [])
    .map((partner: any, index: number) => ({
      id: index,
      link: partner.link || "#",
      title: partner.titulo,
      foto: getStrapiMedia(partner.logo?.data?.attributes?.url) || " ",
      tipo: partner.tipo,
      cor:
        partner.tipo === "Diamante"
          ? ""
          : partner.tipo === "Ouro"
          ? "#FFD700"
          : partner.tipo === "Prata"
          ? "#C0C0C0"
          : "#CD7F32",
      icon:
        partner.tipo === "Diamante"
          ? "💎"
          : partner.tipo === "Ouro"
          ? "🥇"
          : partner.tipo === "Prata"
          ? "🥈"
          : "🥉",
    }))
}

const PartnerCard = ({ partner }: { partner: Partner }) => (
  <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
    <div className="h-full flex flex-col items-center p-4 justify-center">
      <Link href={partner.link} target="_blank" rel="noreferrer">
        <div className="flex justify-center items-center rounded">
          <img
            alt={partner.title}
            className="object-contain object-center"
            src={partner.foto}
            width="300"
            height="300"
          />
        </div>
      </Link>
      <div className="text-center mt-2">
        {(partner.tipo || partner.icon) && (
          <div className="flex justify-center items-center space-x-2">
            {partner.tipo && (
              <>
                <span
                  className="text-white px-3 py-1 tracking-widest text-xs rounded-bl"
                  style={{ backgroundColor: partner.cor }}
                >
                  {partner.tipo}
                </span>
                <span className="text-2xl">{partner.icon}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)

const Parceiros = ({ social, contato, parceiros, navbar }: ParceirosProps) => {
  const { user } = useFetchUser()

  // Process partner data
  const parceirosOrganizacao = processPartners(parceiros.data, "organizacao")
  const parceirosPadrinho = processPartners(
    parceiros.data,
    "parceiros_padrinhos"
  )
  const parceirosPatrocinadores = processPartners(
    parceiros.data,
    "patrocinadores"
  ).sort((a, b) => a.id - b.id)
  const parceirosOperacionais = processPartners(
    parceiros.data,
    "parceiros_operacionais"
  )
  const parceirosApoio = processPartners(parceiros.data, "parceiros_apoio")
  const parceirosMedia = processPartners(parceiros.data, "media_parteners")

  const heading =
    parceirosOrganizacao.length > 1 ? "Organizadores" : "Organizadora"

  // Reusable Section component
  const Section = ({
    title,
    partners,
  }: {
    title: string
    partners: Partner[]
  }) => (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
          <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
            {title}
          </h1>
        </div>
        <div className="flex flex-wrap justify-center">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  )

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Parceiros - Prémio Nacional De Publicidade</title>
        <meta name="description" content={heading} />
      </Head>

      <HeroSection
        title="Parceiros"
        subtitle="Saiba mais sobre aqueles que nos impulsionam"
      />

      <div className="mt-5" />

      {/* Render sections dynamically */}
      <Section title={heading} partners={parceirosOrganizacao} />
      <Section title="Parceiro Institucional" partners={parceirosPadrinho} />
      <Section title="Patrocinadores" partners={parceirosPatrocinadores} />
      <Section
        title="Parceiros Operacionais"
        partners={parceirosOperacionais}
      />
      <Section title="Media Partners" partners={parceirosMedia} />
      <Section title="Apoio" partners={parceirosApoio} />
    </Layout>
  )
}

export default Parceiros

// Server-side data fetching
export async function getServerSideProps() {
  try {
    const rsocials = await fetcher(`${api_link}/api/redes-social?populate=*`)
    const contato = await fetcher(`${api_link}/api/contato`)
    const parceiros = await fetcher(
      `${api_link}/api/parceiros?populate=deep&sort[0]=id:desc&pagination[pageSize]=1`
    )
    const navbar = await fetcher(`${api_link}/api/menus?populate=deep`)

    // Process navbar links
    const dlink = navbar.data.flatMap((value: any) =>
      value.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    return {
      props: { social: rsocials, contato, parceiros, navbar: dlink },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return {
      props: { social: [], contato: [], parceiros: [], navbar: [] },
    }
  }
}
