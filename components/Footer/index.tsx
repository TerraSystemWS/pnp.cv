import Link from "next/link"
import Image from "next/image"
import { useForm, SubmitHandler } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import logo from "public/logo1.png"
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoYoutube,
  IoLogoTwitter,
  IoHome,
  IoDocumentText,
  IoPeople,
  IoNewspaper,
} from "react-icons/io5" // Importing additional icons

interface Contact {
  Local: string
  phone: string
  email: string
  newsletterTitle: string
}

interface FooterProps {
  rsocial: any // Define type for rsocial
  contato: {
    data: {
      attributes: Contact
    }
  }
}

const Footer: React.FC<FooterProps> = ({ rsocial, contato }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>()

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        }
      )

      if (res.ok) {
        toast.success("E-mail enviado com sucesso!")
      } else {
        toast.error("Erro no envio de email")
      }
    } catch (err) {
      console.error("Erro:", err)
    }
  }

  const usefulLinks = [
    { name: "Sobre Nós", link: "/sobreus", icon: <IoPeople /> },
    {
      name: "Termos de Serviço",
      link: "/sobreus/terms",
      icon: <IoDocumentText />,
    },
    {
      name: "Política de Privacidade",
      link: "/sobreus/policy",
      icon: <IoDocumentText />,
    },
  ]

  const websites = [
    { name: "HOME", link: "/", icon: <IoHome /> },
    { name: "REGULAMENTOS", link: "/regulamentos", icon: <IoNewspaper /> },
    { name: "EDIÇÕES", link: "/edicoes", icon: <IoNewspaper /> },
    { name: "PARCEIROS", link: "/parceiros", icon: <IoPeople /> },
    { name: "BLOG", link: "/posts", icon: <IoNewspaper /> },
    { name: "CONTATOS", link: "/contatos", icon: <IoPeople /> },
  ]

  const d = new Date()
  const year = d.getFullYear()

  return (
    <footer style={{ position: "relative", zIndex: 50 }}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="p-10 bg-black text-yellow-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Contact Information */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold uppercase">
                <Image src={logo} alt="logo" />
              </h4>
              <p className="text-gray-300">
                {contato.data.attributes.Local}
                <br />
                {contato.data.attributes.phone}
                <br />
                {contato.data.attributes.email}
              </p>
            </div>

            {/* Useful Links */}
            <div className="space-y-4">
              <h4 className="uppercase font-semibold">Links Úteis</h4>
              <ul className="text-gray-300">
                {usefulLinks.map((link) => (
                  <li
                    key={link.name}
                    className="flex items-center hover:text-yellow-500 uppercase"
                  >
                    <span className="mr-2">{link.icon}</span>
                    <Link href={link.link}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Website Links */}
            <div className="space-y-4">
              <h4 className="uppercase font-semibold">Website</h4>
              <ul className="text-gray-300">
                {websites.map((link) => (
                  <li
                    key={link.link}
                    className="flex items-center hover:text-yellow-500"
                  >
                    <span className="mr-2">{link.icon}</span>
                    <Link href={link.link}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-4">
              <h4 className="uppercase font-semibold">
                Subscreva A Nossa NewsLetter
              </h4>
              <p className="text-gray-300 pb-2">
                {contato.data.attributes.newsletterTitle}
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-row flex-wrap"
              >
                <input
                  type="email"
                  className="text-yellow-500 w-2/3 p-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="email@pnp.cv"
                  {...register("email", { required: true })}
                />
                <button
                  type="submit"
                  className="p-2 w-1/3 bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  Subscreva
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full bg-yellow-500 text-white px-10">
        <div className="max-w-7xl flex flex-col sm:flex-row py-4 mx-auto justify-between items-center">
          <div className="text-center">
            <div>
              PNP <strong>Copyright &copy; {year}</strong>. Todos os direitos
              reservados.
            </div>
          </div>

          {/* Social Icons */}
          <div className="text-center text-xl mb-2">
            <Link
              href="https://www.facebook.com/PNPCaboVerde/"
              target="_blank"
              className="w-10 h-10 rounded-full bg-black hover:bg-yellow-600 mx-1 inline-block pt-1"
              aria-label="Facebook"
            >
              <IoLogoFacebook />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="w-10 h-10 rounded-full bg-black hover:bg-yellow-600 mx-1 inline-block pt-1"
              aria-label="Instagram"
            >
              <IoLogoInstagram />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="w-10 h-10 rounded-full bg-black hover:bg-yellow-600 mx-1 inline-block pt-1"
              aria-label="YouTube"
            >
              <IoLogoYoutube />
            </Link>
            <Link
              href="#"
              target="_blank"
              className="w-10 h-10 rounded-full bg-black hover:bg-yellow-600 mx-1 inline-block pt-1"
              aria-label="Twitter"
            >
              <IoLogoTwitter />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
