/**
 * Smoke tests for the Nav component.
 * These reproduce the production crash:
 *   TypeError: Cannot read properties of undefined (reading 'map')
 *   at Nav (chunks/599.js:603:40)
 *
 * The component must render without throwing for any navbar value,
 * and must render links when valid data is passed.
 */

import React from "react"
import { render, screen } from "@testing-library/react"

// ── heavy dependency mocks ────────────────────────────────────────────────────

jest.mock("../../lib/authContext", () => ({
  useUser: () => ({ user: null, loading: false }),
}))

jest.mock("../../lib/api", () => ({
  fetcher: jest.fn(),
}))

jest.mock("../../lib/auth", () => ({
  setToken: jest.fn(),
  unsetToken: jest.fn(),
}))

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} src={typeof props.src === "string" ? props.src : ""} alt={props.alt ?? ""} />
  ),
}))

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock("primereact/dialog", () => ({ Dialog: () => null }))
jest.mock("primereact/button", () => ({ Button: () => null }))
jest.mock("primereact/password", () => ({ Password: () => null }))
jest.mock("primereact/inputtext", () => ({ InputText: () => null }))
jest.mock("react-icons/io5", () => ({
  IoGridOutline: () => <span>menu</span>,
  IoClose: () => <span>close</span>,
}))
jest.mock("primereact/resources/themes/lara-light-indigo/theme.css", () => ({}))
jest.mock("primereact/resources/primereact.min.css", () => ({}))
jest.mock("primeicons/primeicons.css", () => ({}))

// ── import component AFTER mocks ─────────────────────────────────────────────

import Nav from "../../components/Navbar"

// ── tests ─────────────────────────────────────────────────────────────────────

describe("Nav component", () => {
  it("renders without crashing when navbar is undefined — production crash case", () => {
    expect(() => render(<Nav navbar={undefined} />)).not.toThrow()
  })

  it("renders without crashing when navbar is null", () => {
    expect(() => render(<Nav navbar={null} />)).not.toThrow()
  })

  it("renders without crashing when navbar is an empty array", () => {
    expect(() => render(<Nav navbar={[]} />)).not.toThrow()
  })

  it("renders nav links when valid navbar is provided", () => {
    const links = [
      { name: "Início", link: "/" },
      { name: "Projectos", link: "/projectos" },
    ]
    render(<Nav navbar={links} />)
    // Links appear in both desktop nav and mobile drawer — at least one must exist
    expect(screen.getAllByText("Início").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Projectos").length).toBeGreaterThan(0)
  })

  it("renders the login button when user is not authenticated", () => {
    render(<Nav navbar={[]} />)
    // Login appears in both desktop and mobile drawer
    expect(screen.getAllByText("Login").length).toBeGreaterThan(0)
  })
})
