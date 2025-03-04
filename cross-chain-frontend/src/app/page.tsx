
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Wallet,
  Shield,
  TrendingUp,
  ChevronDown,
  Banknote,
  Landmark,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Steps data
  const steps = [
    {
      id: 1,
      title: "Connect Wallet",
      icon: <Wallet className="w-6 h-6" />,
      description:
        "Connect your wallet (Monad Testnet) via Thirdweb Wallet Connect. If connected to the wrong network, you'll be prompted to switch to Monad Testnet.",
    },
    {
      id: 2,
      title: "Get Whitelisted & Mint an NFT",
      icon: <CheckCircle2 className="w-6 h-6" />,
      description:
        "Admin manually whitelists addresses. Users mint a test NFT (Max 5 per wallet, but only 1 mint per whitelist entry). The minted NFT does not automatically display in the UI yet.",
    },
    {
      id: 3,
      title: "Deposit NFT as Collateral",
      icon: <Shield className="w-6 h-6" />,
      description:
        'Select a whitelisted NFT collection from the dropdown. Enter the tokenId (fetched from the explorer). Click "Deposit NFT" to transfer your NFT to the smart contract vault as collateral.',
    },
    {
      id: 4,
      title: "Borrow USDT Against NFT",
      icon: <Banknote className="w-6 h-6" />,
      description:
        'Enter the loan amount (up to 70% of the NFT\'s floor price in USDT). Click "Borrow" to trigger the smart contract to issue a loan. Receive USDT in your wallet while your NFT remains locked.',
    },
    {
      id: 5,
      title: "Repay Loan & Reclaim NFT",
      icon: <ArrowRight className="w-6 h-6" />,
      description:
        "Repay the borrowed USDT + interest before the due date. After successful repayment, withdraw your NFT from the vault.",
    },
    {
      id: 6,
      title: "Liquidation (If Loan Defaults)",
      icon: <AlertTriangle className="w-6 h-6" />,
      description:
        "If you fail to repay within the loan period, the NFT is automatically liquidated and transferred to the protocol. The USDT is returned to LPs, and the NFT is auctioned to recover liquidity.",
    },
    {
      id: 7,
      title: "Provide Liquidity & Earn",
      icon: <Landmark className="w-6 h-6" />,
      description:
        "Deposit USDT into the LendHub Liquidity Pool to fund loans. Earn interest from borrower repayments and accumulate reward points based on amount, duration, and utilization.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0D111C] to-[#131A2A] text-gray-100">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#131A2A]/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#8B5CF6]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">
              MonadLend
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-[#98A1C0] hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#rewards" className="text-[#98A1C0] hover:text-white transition-colors">
              Rewards
            </Link>
            <Link href="#faq" className="text-[#98A1C0] hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          {/* <div>
            <ConnectWallet
              theme="dark"
              btnTitle="Connect Wallet"
              className="!bg-[#1C2839] !text-white !border-[#2C3545] !rounded-xl"
            />
          </div> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center max-w-full">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-[#1C2839] rounded-full text-sm font-medium text-[#8B5CF6] border border-[#2C3545]">
                Monad Testnet NFT Lending Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">
                  Borrow & Lend
                </span>{" "}
                with your NFT collection
              </h1>
              <p className="text-xl text-[#98A1C0]">
                Access liquidity without selling your valuable NFTs. Our platform enables you to use your NFTs as
                collateral for loans on the Monad blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Link href="./lending" className="inline-block">
                  <button
                    className="relative group overflow-hidden rounded-full px-8 py-4 font-medium text-white shadow-lg transition-all duration-300 ease-out w-full sm:w-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      background: "linear-gradient(to right, #8B5CF6, #6366F1)",
                      boxShadow: isHovered
                        ? "0 10px 25px -3px rgba(99, 102, 241, 0.5)"
                        : "0 4px 6px -1px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {/* Animated background shine effect */}
                    <span
                      className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      }}
                    />

                    {/* Button text with icon */}
                    <span className="flex items-center justify-center gap-2 transform group-hover:translate-x-1 transition-transform duration-300">
                      Launch App
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>

                    {/* Subtle border glow */}
                    <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-300" />
                  </button>
                </Link>

                <Link href="#how-it-works">
                  <button className="px-8 py-4 rounded-full border border-[#2C3545] bg-[#1C2839] text-white hover:bg-[#2C3545] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                    How It Works
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative w-full max-w-[400px] mx-auto md:ml-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-[#1C2839] border border-[#2C3545] rounded-3xl p-6 shadow-xl">
                <div className="aspect-square w-full rounded-2xl overflow-hidden relative">
                  <Image
                    src="/placeholder.svg?height=600&width=600"
                    alt="NFT Collateral Example"
                    width={600}
                    height={600}
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0D111C] to-transparent p-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-[#98A1C0]">NFT Floor Price</p>
                        <p className="text-xl font-bold">12.5 MON</p>
                      </div>
                      <div className="bg-[#1C2839]/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-[#2C3545]">
                        <p className="text-sm font-medium text-[#6366F1]">Borrow up to 8.75 MON</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How MonadLend Works</h2>
            <p className="text-[#98A1C0] text-lg max-w-2xl mx-auto">
              Follow these steps to borrow against your NFTs or provide liquidity
            </p>
          </div>

          {/* Steps Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeStep === step.id ? "bg-[#8B5CF6] text-white" : "bg-[#1C2839] text-[#98A1C0] hover:bg-[#2C3545]"
                }`}
              >
                {step.id}. {step.title}
              </button>
            ))}
          </div>

          {/* Active Step Display */}
          <div className="bg-[#1C2839] border border-[#2C3545] rounded-2xl p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-20 h-20 rounded-full bg-[#2C3545] flex items-center justify-center flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center">
                  {steps[activeStep - 1].icon}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">
                  Step {activeStep}: {steps[activeStep - 1].title}
                </h3>
                <p className="text-[#98A1C0] text-lg">{steps[activeStep - 1].description}</p>
              </div>
            </div>

            {/* Step-specific illustrations */}
            {activeStep === 1 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <Wallet className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Connect your wallet</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <Shield className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Switch to Monad Testnet</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <CheckCircle2 className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Get whitelisted by admin</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="NFT"
                      width={48}
                      height={48}
                      className="mx-auto mb-2 rounded-lg"
                    />
                    <p className="text-sm text-[#98A1C0]">Mint test NFT (max 5 per wallet)</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-[#2C3545] rounded-lg flex items-center justify-center">
                      <span className="text-[#8B5CF6] font-bold">#123</span>
                    </div>
                    <p className="text-sm text-[#98A1C0]">Enter NFT token ID</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <Shield className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">NFT locked in vault</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <div className="w-12 h-12 mx-auto mb-2 bg-[#2C3545] rounded-lg flex items-center justify-center">
                      <span className="text-[#8B5CF6] font-bold">70%</span>
                    </div>
                    <p className="text-sm text-[#98A1C0]">Enter loan amount (up to 70% of value)</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <Banknote className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Receive USDT in your wallet</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <Banknote className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Repay USDT + interest</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="NFT"
                      width={48}
                      height={48}
                      className="mx-auto mb-2 rounded-lg"
                    />
                    <p className="text-sm text-[#98A1C0]">Withdraw your NFT</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <Clock className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Loan period expires</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">NFT liquidated and auctioned</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 7 && (
              <div className="mt-8 bg-[#131A2A] rounded-xl p-4 border border-[#2C3545]">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <div className="p-4">
                    <Landmark className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Deposit USDT into liquidity pool</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#2C3545] hidden sm:block" />
                  <div className="p-4">
                    <Award className="w-12 h-12 text-[#8B5CF6] mx-auto mb-2" />
                    <p className="text-sm text-[#98A1C0]">Earn interest + reward points</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className={`px-4 py-2 rounded-lg border border-[#2C3545] ${
                activeStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2C3545]"
              }`}
              disabled={activeStep === 1}
            >
              Previous Step
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(7, prev + 1))}
              className={`px-4 py-2 rounded-lg border border-[#2C3545] ${
                activeStep === 7 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2C3545]"
              }`}
              disabled={activeStep === 7}
            >
              Next Step
            </button>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-20 px-6 bg-[#0D111C]/50">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Liquidity Provider Rewards</h2>
            <p className="text-[#98A1C0] text-lg max-w-2xl mx-auto">
              Earn points and rewards by providing liquidity to the platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Banknote className="w-6 h-6 text-[#8B5CF6]" />,
                title: "Deposit Amount",
                description:
                  "Higher deposits earn more points. The more USDT you provide to the liquidity pool, the greater your rewards.",
              },
              {
                icon: <Clock className="w-6 h-6 text-[#8B5CF6]" />,
                title: "Time Duration",
                description:
                  "Longer duration equals higher points. Keep your liquidity in the pool longer to maximize your rewards.",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-[#8B5CF6]" />,
                title: "Utilization Rate",
                description:
                  "Get boosted points when your funds are actively used for lending. Active participation increases rewards.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#1C2839] border border-[#2C3545] rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#2C3545] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-[#98A1C0]">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#1C2839] border border-[#2C3545] rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-center">Reward Points Redemption</h3>
            <p className="text-[#98A1C0] text-center mb-8">
              Accumulated points can be redeemed later for additional benefits.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#131A2A] rounded-xl p-6 border border-[#2C3545]">
                <Award className="w-12 h-12 text-[#8B5CF6] mb-4" />
                <h4 className="text-xl font-bold mb-2">Some Kind of Rewards</h4>
                <p className="text-[#98A1C0]">
                  Points will be redeemed for some rewards
                </p>
              </div>

              <div className="bg-[#131A2A] rounded-xl p-6 border border-[#2C3545]">
                <Shield className="w-12 h-12 text-[#8B5CF6] mb-4" />
                <h4 className="text-xl font-bold mb-2">Platform Benefits</h4>
                <p className="text-[#98A1C0]">
                  Unlock special platform features, reduced fees, and priority access to new features based on your
                  point total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-[#98A1C0] text-lg">Everything you need to know about MonadLend</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "How do I get whitelisted to mint NFTs?",
                answer: (
                  <span>
                    Currently, the admin manually whitelists addresses for testing purposes. Contact{" "}
                    <a
                      href="https://discord.com/channels/@me/952805903881617449"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                    >
                      bosonormal1 on Discord
                    </a>{" "}
                    or{" "}
                    <a
                      href="https://web.telegram.org/k/#@adonormal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8B5CF6] hover:text-[#6366F1] transition-colors"
                    >
                      adonormal on Telegram
                    </a>{" "}
                    to request whitelisting.
                  </span>
                ),
              },
              {
                question: "How is the loan amount determined?",
                answer:
                  "Loan amounts are calculated based on the floor price of your NFT, typically up to 70% of the NFT's value in USDT.",
              },
              {
                question: "What happens if I don't repay my loan?",
                answer:
                  "If you don't repay your loan by the end of the term, your NFT collateral will be automatically liquidated and transferred to the protocol for auction.",
              },
              {
                question: "How do I earn reward points as a liquidity provider?",
                answer:
                  "You earn points based on three factors: the amount of USDT you deposit, how long your liquidity remains in the pool, and the utilization rate of your funds for loans.",
              },
              {
                question: "When will the reward points be redeemable?",
                answer:
                  "Points will be redeemable for token platform rewards and other benefits when the platform launches on mainnet. Early testnet participants will receive bonus points.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-[#1C2839] border border-[#2C3545] rounded-xl p-6">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-[#98A1C0]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#0D111C]/50">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1C2839] to-[#131A2A] rounded-3xl p-12 border border-[#2C3545] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6366F1]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start using MonadLend?</h2>
            <p className="text-[#98A1C0] text-lg mb-8 max-w-2xl mx-auto">
              Connect your wallet, get whitelisted, and start borrowing against your NFTs or providing liquidity today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="./lending" className="inline-block">
                <button
                  className="relative group overflow-hidden rounded-full px-10 py-4 font-medium text-white shadow-lg transition-all duration-300 ease-out w-full sm:w-auto"
                  style={{
                    background: "linear-gradient(to right, #8B5CF6, #6366F1)",
                  }}
                >
                  <span
                    className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                  <span className="flex items-center justify-center gap-2 text-lg">
                    Launch App
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              </Link>

              <Link href="#how-it-works">
                <button className="px-10 py-4 rounded-full border border-[#2C3545] bg-[#1C2839] text-white hover:bg-[#2C3545] transition-colors w-full sm:w-auto flex items-center justify-center gap-2 text-lg">
                  Learn More
                  <ChevronDown className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#2C3545]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-[#8B5CF6]" />
                <span className="text-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-transparent bg-clip-text">
                  MonadLend
                </span>
              </div>
              <p className="text-[#98A1C0] text-sm">The premier NFT lending platform on Monad blockchain.</p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#how-it-works" className="text-[#98A1C0] hover:text-white text-sm">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#rewards" className="text-[#98A1C0] hover:text-white text-sm">
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-[#98A1C0] hover:text-white text-sm">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a href='https://discord.com/channels/@me/952805903881617449' 
                    className="text-[#98A1C0] hover:text-white text-sm" 
                     target="_blank"
                      rel="noopener noreferrer"
                      >
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://web.telegram.org/k/#@adonormal" 
                    className="text-[#98A1C0] hover:text-white text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="https://x.com/bossonormal1" 
                   className="text-[#98A1C0] hover:text-white text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-[#98A1C0] hover:text-white text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com/bossonormal215/monad-nft-lendhub" className="text-[#98A1C0] hover:text-white text-sm">
                    GitHub
                  </a>
                </li>
                <li>
                  <Link href="/lending" className="text-[#98A1C0] hover:text-white text-sm">
                    Monad Testnet
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#2C3545] flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#98A1C0] text-sm">© {new Date().getFullYear()} MonadLend. All rights reserved.</p>

            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-[#98A1C0] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-[#98A1C0] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-[#98A1C0] hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

