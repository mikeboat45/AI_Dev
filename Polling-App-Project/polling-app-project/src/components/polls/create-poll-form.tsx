"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PollOption {
  id: string
  text: string
}

import { pollsApi } from "@/lib/api"

export function CreatePollForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: [
      { id: "1", text: "" },
      { id: "2", text: "" }
    ]
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    
    
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleOptionChange = (id: string, text: string) => {
    setFormData({
      ...formData,
      options: formData.options.map(option =>
        option.id === id ? { ...option, text } : option
      )
    })
  }

  const addOption = () => {
    const newId = (formData.options.length + 1).toString()
    setFormData({
      ...formData,
      options: [...formData.options, { id: newId, text: "" }]
    })
  }

  const removeOption = (id: string) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter(option => option.id !== id)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const res = await pollsApi.create({ title: formData.title, description: formData.description, options: formData.options.map(o => o.text) })
    setIsLoading(false)
    if (!res) {
      setError("Failed to create poll")
      return
    }
    setFormData({
      title: "",
      description: "",
      options: [
        { id: "1", text: "" },
        { id: "2", text: "" }
      ]
    })
  }

  const isValid = formData.title.trim() && 
    formData.title.trim().length >= 5 &&
    formData.options.every(option => option.text.trim()) &&
    formData.options.length >= 2

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a new poll and share it with others to gather votes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter poll title (min. 5 characters)"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Enter poll description (optional)"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Poll Options *</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                    required
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(option.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Creating Poll..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
