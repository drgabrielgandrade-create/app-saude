'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Search, 
  Plus, 
  Filter,
  Stethoscope,
  Brain,
  Heart,
  Activity,
  UserPlus,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Patient {
  id: string
  name: string
  birth_date: string
  cpf: string
  phone: string
  email: string
  address: string
  emergency_contact: string
  medical_history: string
  created_at: string
}

interface Evolution {
  id: string
  patient_id: string
  professional_id: string
  profession: string
  date: string
  content: string
  created_at: string
  profiles?: {
    full_name: string
  }
}

interface Document {
  id: string
  patient_id: string
  name: string
  type: string
  category: string
  file_url: string
  uploaded_by: string
  created_at: string
}

const professions = [
  { value: 'medicina', label: 'Medicina', icon: Stethoscope, color: 'bg-red-100 text-red-800' },
  { value: 'fisioterapia', label: 'Fisioterapia', icon: Activity, color: 'bg-blue-100 text-blue-800' },
  { value: 'psicologia', label: 'Psicologia', icon: Brain, color: 'bg-purple-100 text-purple-800' },
  { value: 'enfermagem', label: 'Enfermagem', icon: Heart, color: 'bg-green-100 text-green-800' },
  { value: 'nutricao', label: 'Nutrição', icon: Users, color: 'bg-orange-100 text-orange-800' },
  { value: 'terapia_ocupacional', label: 'Terapia Ocupacional', icon: Users, color: 'bg-indigo-100 text-indigo-800' }
]

const documentCategories = [
  'Médico',
  'Fisioterapia', 
  'Psicologia',
  'Enfermagem',
  'Nutrição',
  'Terapia Ocupacional',
  'Geral'
]

const documentTemplates = {
  medicina: [
    'Anamnese Médica',
    'Exame Físico',
    'Prescrição Médica',
    'Atestado Médico',
    'Relatório Médico'
  ],
  fisioterapia: [
    'Avaliação Fisioterapêutica',
    'Plano de Tratamento',
    'Evolução Fisioterapêutica',
    'Relatório de Alta',
    'Termo de Consentimento'
  ],
  psicologia: [
    'Anamnese Psicológica',
    'Avaliação Psicológica',
    'Relatório Psicológico',
    'Plano Terapêutico',
    'Evolução Psicológica'
  ],
  enfermagem: [
    'Histórico de Enfermagem',
    'Evolução de Enfermagem',
    'Prescrição de Enfermagem',
    'Relatório de Enfermagem',
    'Controle de Sinais Vitais'
  ]
}

function HealthcareApp() {
  const { user, profile, loading, signOut } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [evolutions, setEvolutions] = useState<Evolution[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProfession, setFilterProfession] = useState('')
  const [activeTab, setActiveTab] = useState('patients')
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isAddEvolutionOpen, setIsAddEvolutionOpen] = useState(false)
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false)

  // Form states
  const [newPatient, setNewPatient] = useState({
    name: '',
    birth_date: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact: '',
    medical_history: ''
  })

  const [newEvolution, setNewEvolution] = useState({
    profession: '',
    date: new Date().toISOString().split('T')[0],
    content: ''
  })

  const [profileSetup, setProfileSetup] = useState({
    full_name: '',
    profession: '',
    role: 'professional' as 'admin' | 'professional' | 'student'
  })

  useEffect(() => {
    if (user && profile) {
      fetchPatients()
    }
  }, [user, profile])

  useEffect(() => {
    if (selectedPatient) {
      fetchEvolutions(selectedPatient.id)
      fetchDocuments(selectedPatient.id)
    }
  }, [selectedPatient])

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching patients:', error)
    } else {
      setPatients(data || [])
    }
  }

  const fetchEvolutions = async (patientId: string) => {
    const { data, error } = await supabase
      .from('evolutions')
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq('patient_id', patientId)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching evolutions:', error)
    } else {
      setEvolutions(data || [])
    }
  }

  const fetchDocuments = async (patientId: string) => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
    } else {
      setDocuments(data || [])
    }
  }

  const addPatient = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('patients')
      .insert([{
        ...newPatient,
        created_by: user.id
      }])
      .select()

    if (error) {
      console.error('Error adding patient:', error)
    } else {
      setPatients([...patients, data[0]])
      setNewPatient({
        name: '',
        birth_date: '',
        cpf: '',
        phone: '',
        email: '',
        address: '',
        emergency_contact: '',
        medical_history: ''
      })
      setIsAddPatientOpen(false)
    }
  }

  const addEvolution = async () => {
    if (!user || !selectedPatient) return

    const { data, error } = await supabase
      .from('evolutions')
      .insert([{
        patient_id: selectedPatient.id,
        professional_id: user.id,
        ...newEvolution
      }])
      .select(`
        *,
        profiles (
          full_name
        )
      `)

    if (error) {
      console.error('Error adding evolution:', error)
    } else {
      setEvolutions([data[0], ...evolutions])
      setNewEvolution({
        profession: '',
        date: new Date().toISOString().split('T')[0],
        content: ''
      })
      setIsAddEvolutionOpen(false)
    }
  }

  const setupProfile = async () => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert([{
        id: user.id,
        email: user.email!,
        ...profileSetup
      }])

    if (error) {
      console.error('Error setting up profile:', error)
    } else {
      setIsProfileSetupOpen(false)
      window.location.reload()
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  )

  const filteredEvolutions = evolutions.filter(evolution =>
    filterProfession === '' || evolution.profession === filterProfession
  )

  const getProfessionIcon = (profession: string) => {
    const prof = professions.find(p => p.value === profession)
    return prof ? prof.icon : Users
  }

  const getProfessionColor = (profession: string) => {
    const prof = professions.find(p => p.value === profession)
    return prof ? prof.color : 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Sistema de Saúde
            </CardTitle>
            <CardDescription>
              Plataforma profissional para equipes multidisciplinares
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
              redirectTo={window.location.origin}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Configurar Perfil</CardTitle>
            <CardDescription>
              Complete seu perfil para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                value={profileSetup.full_name}
                onChange={(e) => setProfileSetup({...profileSetup, full_name: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Profissão</label>
              <Select
                value={profileSetup.profession}
                onValueChange={(value) => setProfileSetup({...profileSetup, profession: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua profissão" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((prof) => (
                    <SelectItem key={prof.value} value={prof.value}>
                      {prof.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de Usuário</label>
              <Select
                value={profileSetup.role}
                onValueChange={(value: 'admin' | 'professional' | 'student') => 
                  setProfileSetup({...profileSetup, role: value})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Profissional</SelectItem>
                  <SelectItem value="student">Estudante</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={setupProfile} className="w-full">
              Configurar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Saúde</h1>
                <p className="text-sm text-gray-500">Gestão Multiprofissional</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile.profession}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="patients" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Pacientes</span>
            </TabsTrigger>
            <TabsTrigger value="evolutions" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Evoluções</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4" />
              <span>Documentos</span>
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar pacientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Paciente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do paciente para criar um novo prontuário
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nome Completo *</label>
                      <Input
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                        placeholder="Nome do paciente"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Data de Nascimento *</label>
                      <Input
                        type="date"
                        value={newPatient.birth_date}
                        onChange={(e) => setNewPatient({...newPatient, birth_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CPF *</label>
                      <Input
                        value={newPatient.cpf}
                        onChange={(e) => setNewPatient({...newPatient, cpf: e.target.value})}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Telefone *</label>
                      <Input
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={newPatient.email}
                        onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contato de Emergência</label>
                      <Input
                        value={newPatient.emergency_contact}
                        onChange={(e) => setNewPatient({...newPatient, emergency_contact: e.target.value})}
                        placeholder="Nome e telefone"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Endereço</label>
                      <Input
                        value={newPatient.address}
                        onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                        placeholder="Endereço completo"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Histórico Médico</label>
                      <Textarea
                        value={newPatient.medical_history}
                        onChange={(e) => setNewPatient({...newPatient, medical_history: e.target.value})}
                        placeholder="Histórico médico relevante..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={addPatient}>
                      Cadastrar Paciente
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient?.id === patient.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <Badge variant="secondary">
                        {new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} anos
                      </Badge>
                    </div>
                    <CardDescription>
                      CPF: {patient.cpf}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📞 {patient.phone}</p>
                      {patient.email && <p>✉️ {patient.email}</p>}
                      <p className="text-xs text-gray-500">
                        Cadastrado em {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum paciente encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Comece cadastrando um novo paciente'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Evolutions Tab */}
          <TabsContent value="evolutions" className="space-y-6">
            {selectedPatient ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">Evoluções Multiprofissionais</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Select value={filterProfession} onValueChange={setFilterProfession}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filtrar por profissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as profissões</SelectItem>
                        {professions.map((prof) => (
                          <SelectItem key={prof.value} value={prof.value}>
                            {prof.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Dialog open={isAddEvolutionOpen} onOpenChange={setIsAddEvolutionOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Evolução
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Nova Evolução - {selectedPatient.name}</DialogTitle>
                          <DialogDescription>
                            Registre uma nova evolução para este paciente
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Profissão *</label>
                              <Select
                                value={newEvolution.profession}
                                onValueChange={(value) => setNewEvolution({...newEvolution, profession: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a profissão" />
                                </SelectTrigger>
                                <SelectContent>
                                  {professions.map((prof) => (
                                    <SelectItem key={prof.value} value={prof.value}>
                                      {prof.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Data *</label>
                              <Input
                                type="date"
                                value={newEvolution.date}
                                onChange={(e) => setNewEvolution({...newEvolution, date: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Evolução *</label>
                            <Textarea
                              value={newEvolution.content}
                              onChange={(e) => setNewEvolution({...newEvolution, content: e.target.value})}
                              placeholder="Descreva a evolução do paciente..."
                              rows={6}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setIsAddEvolutionOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={addEvolution}>
                            Salvar Evolução
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredEvolutions.map((evolution) => {
                    const ProfessionIcon = getProfessionIcon(evolution.profession)
                    return (
                      <Card key={evolution.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getProfessionColor(evolution.profession)}`}>
                                <ProfessionIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <CardTitle className="text-lg capitalize">
                                  {evolution.profession.replace('_', ' ')}
                                </CardTitle>
                                <CardDescription>
                                  {evolution.profiles?.full_name} • {new Date(evolution.date).toLocaleDateString('pt-BR')}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {new Date(evolution.created_at).toLocaleTimeString('pt-BR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 whitespace-pre-wrap">{evolution.content}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {filteredEvolutions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma evolução encontrada</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {filterProfession ? 'Tente ajustar o filtro' : 'Comece registrando uma nova evolução'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Selecione um paciente</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Escolha um paciente na aba "Pacientes" para ver suas evoluções
                </p>
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            {selectedPatient ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">Documentos e Arquivos</p>
                  </div>
                  
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documento
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentCategories.map((category) => (
                    <Card key={category}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
                          {category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {documents
                            .filter(doc => doc.category === category)
                            .map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm truncate">{doc.name}</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          {documents.filter(doc => doc.category === category).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              Nenhum documento
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Document Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Modelos de Documentos</CardTitle>
                    <CardDescription>
                      Modelos pré-definidos para avaliações e documentos clínicos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {professions.map((profession) => (
                        <div key={profession.value} className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-900 capitalize">
                            {profession.label}
                          </h4>
                          <div className="space-y-1">
                            {(documentTemplates[profession.value as keyof typeof documentTemplates] || []).map((template) => (
                              <Button
                                key={template}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-8"
                              >
                                <FileText className="w-3 h-3 mr-2" />
                                {template}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Selecione um paciente</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Escolha um paciente na aba "Pacientes" para ver seus documentos
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <HealthcareApp />
    </AuthProvider>
  )
}