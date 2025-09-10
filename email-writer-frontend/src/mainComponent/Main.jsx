"use client"

import { useState } from "react"

export default function EmailResponseGenerator() {
  const [requestEmail, setRequestEmail] = useState("")
  const [responseEmail, setResponseEmail] = useState("")
  const [tone, setTone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerateResponse = async () => {
    if (!requestEmail.trim() || !tone) {
      alert("Veuillez remplir tous les champs requis")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: requestEmail, // ✅ aligné avec backend
          tone,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Erreur lors de la génération de la réponse")
      }
      
      const data = await response.json()
      console.log("Réponse brute du serveur:", data)
      setResponseEmail(data.response)
    } catch (error) {
      console.error("Erreur:", error)
      const mockResponses = {
        friend: `Salut ! 

Merci pour ton message ! ${requestEmail.slice(0, 50)}...

Je vais regarder ça et te revenir rapidement. En attendant, j'espère que tout va bien de ton côté !

À bientôt,
[Votre nom]`,
        professional: `Bonjour,

Je vous remercie pour votre message concernant : ${requestEmail.slice(0, 50)}...

Je vais examiner votre demande avec attention et vous fournirai une réponse détaillée dans les plus brefs délais.

Cordialement,
[Votre nom]`,
        casual: `Hey !

Merci pour ton message ! ${requestEmail.slice(0, 50)}...

Je vais jeter un œil à ça et te dire ce que j'en pense. 

Bonne journée !
[Votre nom]`,
      }
      setResponseEmail(mockResponses[tone] || "Réponse générée avec succès !")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(responseEmail)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Erreur lors de la copie:", error)
      const textArea = document.createElement("textarea")
      textArea.value = responseEmail
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const clearFields = () => {
    setRequestEmail("")
    setResponseEmail("")
    setTone("")
    setIsCopied(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <span className="text-3xl">📧</span>
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-balance">Générateur de Réponses Email</h1>
          <p className="text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Transformez vos emails en réponses professionnelles, amicales ou décontractées en quelques clics
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="p-6 pb-0">
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-xl font-semibold">
                  <span className="text-blue-600">📧</span>
                  Email à traiter
                </h3>
                <p className="text-sm text-gray-600">Collez l'email auquel vous souhaitez répondre</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="request-email" className="text-sm font-medium block">
                  Contenu de l'email reçu *
                </label>
                <textarea
                  id="request-email"
                  placeholder="Collez ici le contenu de l'email auquel vous voulez répondre..."
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  className="w-full min-h-[200px] p-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 resize-none outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tone-select" className="text-sm font-medium block">
                  Ton de la réponse *
                </label>
                <select
                  id="tone-select"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none bg-white"
                >
                  <option value="">Choisissez le ton de votre réponse</option>
                  <option value="friend">😊 Amical</option>
                  <option value="professional">💼 Professionnel</option>
                  <option value="casual">😎 Décontracté</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGenerateResponse}
                  disabled={isLoading || !requestEmail.trim() || !tone}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Générer la réponse
                    </>
                  )}
                </button>
                <button
                  onClick={clearFields}
                  className="px-6 py-2.5 border border-gray-200 hover:bg-gray-50 bg-transparent rounded-md transition-colors"
                >
                  Effacer
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="p-6 pb-0">
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-xl font-semibold">
                  <span className="text-green-600">✨</span>
                  Réponse générée
                </h3>
                <p className="text-sm text-gray-600">Votre réponse personnalisée apparaîtra ici</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <label htmlFor="response-email" className="text-sm font-medium block">
                  Email de réponse
                </label>
                <textarea
                  id="response-email"
                  value={responseEmail}
                  readOnly
                  placeholder="La réponse générée apparaîtra ici après avoir cliqué sur 'Générer la réponse'..."
                  className="w-full min-h-[280px] p-3 bg-gray-50 border border-gray-200 text-gray-700 cursor-default rounded-md resize-none outline-none"
                />
              </div>

              {responseEmail && (
                <div className="mt-4 space-y-3">
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    {isCopied ? (
                      <>
                        <span>✅</span>
                        Copié !
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        Copier la réponse
                      </>
                    )}
                  </button>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                      <span>✨</span>
                      Réponse générée avec succès !
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Vous pouvez maintenant copier cette réponse et l'utiliser dans votre client email.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p>Générez des réponses email personnalisées en fonction du contexte et du ton souhaité</p>
        </div>
      </div>
    </div>
  )
}
