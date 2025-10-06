"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  BookOpen,
  Plus,
  Edit,
  Save,
  X,
  Search,
  Users,
  DollarSign,
  Calendar,
  Star
} from "lucide-react"

interface Program {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  isActive: boolean
  enrollmentCount: number
  totalRevenue: number
  createdAt: string
  updatedAt: string
}

interface ProgramsSectionProps {
  programs: Program[]
  programsLoading: boolean
  onAddProgram: (program: Omit<Program, 'id' | 'enrollmentCount' | 'totalRevenue' | 'createdAt' | 'updatedAt'>) => void
  onUpdateProgram: (programId: string, updates: Partial<Program>) => void
  onDeleteProgram: (programId: string) => void
}

export function ProgramsSection({ 
  programs, 
  programsLoading, 
  onAddProgram, 
  onUpdateProgram, 
  onDeleteProgram 
}: ProgramsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    isActive: true
  })

  const handleAddClick = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: '',
      category: '',
      level: 'beginner',
      isActive: true
    })
    setShowAddModal(true)
  }

  const handleEditClick = (program: Program) => {
    setFormData({
      name: program.name,
      description: program.description,
      price: program.price,
      duration: program.duration,
      category: program.category,
      level: program.level,
      isActive: program.isActive
    })
    setEditingProgram(program)
  }

  const handleSave = () => {
    if (editingProgram) {
      onUpdateProgram(editingProgram.id, formData)
      setEditingProgram(null)
    } else {
      onAddProgram(formData)
      setShowAddModal(false)
    }
  }

  const handleCancel = () => {
    setShowAddModal(false)
    setEditingProgram(null)
  }

  const getLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredPrograms = programs.filter(program =>
    (program.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (program.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (program.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.isActive).length,
    totalEnrollments: programs.reduce((sum, p) => sum + (p.enrollmentCount || 0), 0),
    totalRevenue: programs.reduce((sum, p) => sum + (p.totalRevenue || 0), 0)
  }

  if (programsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Programs Management</h2>
        <Button
          onClick={handleAddClick}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Programs</p>
                <p className="text-2xl font-bold text-orange-400">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Programs</p>
                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              </div>
              <Star className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Enrollments</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalEnrollments}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">${stats.totalRevenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search programs by name, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-orange-500/30 text-white placeholder-white/50 focus:ring-orange-500/50"
        />
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="bg-white/5 border-orange-500/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg">{program.name}</CardTitle>
                  <CardDescription className="text-white/70 mt-1">
                    {program.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditClick(program)}
                    variant="outline"
                    size="sm"
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => onDeleteProgram(program.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getLevelColor(program.level)}>
                  {program.level ? program.level.charAt(0).toUpperCase() + program.level.slice(1) : 'Unknown'}
                </Badge>
                <Badge className={program.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {program.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Price:</span>
                  <span className="text-orange-400 font-semibold">${program.price || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Duration:</span>
                  <span className="text-white">{program.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Category:</span>
                  <span className="text-white">{program.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Enrollments:</span>
                  <span className="text-white">{program.enrollmentCount || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Revenue:</span>
                  <span className="text-green-400 font-semibold">${program.totalRevenue || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Programs Found</h3>
          <p className="text-white/70">
            {searchTerm 
              ? 'No programs match your search criteria.' 
              : 'No programs have been created yet.'}
          </p>
        </div>
      )}

      {/* Add/Edit Program Modal */}
      <Dialog open={showAddModal || !!editingProgram} onOpenChange={handleCancel}>
        <DialogContent className="bg-gray-900 border-orange-500/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-400" />
              {editingProgram ? 'Edit Program' : 'Add New Program'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Program Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                  placeholder="Enter program name"
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-white">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                  placeholder="e.g., Strength Training, Cardio"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white placeholder-white/50 resize-none"
                rows={3}
                placeholder="Enter program description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-white">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value) || 0})}
                  className="bg-white/5 border-orange-500/30 text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-white">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="bg-white/5 border-orange-500/30 text-white"
                  placeholder="e.g., 4 weeks, 3 months"
                />
              </div>
              <div>
                <Label htmlFor="level" className="text-white">Level</Label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                  className="w-full p-3 bg-white/5 border border-orange-500/30 rounded-lg text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-4 h-4 text-orange-500 bg-white/5 border-orange-500/30 rounded focus:ring-orange-500/50"
              />
              <Label htmlFor="isActive" className="text-white">Active Program</Label>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingProgram ? 'Update Program' : 'Create Program'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

