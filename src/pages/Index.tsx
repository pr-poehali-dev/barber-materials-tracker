import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  category: string;
}

interface UsageRecord {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  client: string;
  service: string;
  date: string;
}

const INITIAL_MATERIALS: Material[] = [
  { id: '1', name: 'Краска для волос (Блонд)', quantity: 45, unit: 'мл', minQuantity: 20, category: 'Окрашивание' },
  { id: '2', name: 'Краска для волос (Каштан)', quantity: 60, unit: 'мл', minQuantity: 20, category: 'Окрашивание' },
  { id: '3', name: 'Шампунь профессиональный', quantity: 850, unit: 'мл', minQuantity: 200, category: 'Уход' },
  { id: '4', name: 'Кондиционер', quantity: 520, unit: 'мл', minQuantity: 200, category: 'Уход' },
  { id: '5', name: 'Маска для волос', quantity: 180, unit: 'мл', minQuantity: 100, category: 'Уход' },
  { id: '6', name: 'Фольга для мелирования', quantity: 250, unit: 'листов', minQuantity: 50, category: 'Окрашивание' },
  { id: '7', name: 'Перчатки одноразовые', quantity: 180, unit: 'шт', minQuantity: 50, category: 'Расходники' },
  { id: '8', name: 'Окислитель 3%', quantity: 320, unit: 'мл', minQuantity: 100, category: 'Окрашивание' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'usage' | 'warehouse' | 'stats'>('home');
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([
    { id: '1', materialId: '1', materialName: 'Краска для волос (Блонд)', quantity: 50, client: 'Мария Петрова', service: 'Окрашивание', date: '2025-11-25' },
    { id: '2', materialId: '3', materialName: 'Шампунь профессиональный', quantity: 30, client: 'Анна Смирнова', service: 'Стрижка + укладка', date: '2025-11-25' },
    { id: '3', materialId: '2', materialName: 'Краска для волос (Каштан)', quantity: 60, client: 'Елена Иванова', service: 'Окрашивание', date: '2025-11-24' },
  ]);

  const [newUsage, setNewUsage] = useState({
    materialId: '',
    quantity: '',
    client: '',
    service: '',
  });

  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    unit: 'мл',
    minQuantity: '',
    category: '',
  });

  const handleAddUsage = () => {
    if (!newUsage.materialId || !newUsage.quantity || !newUsage.client || !newUsage.service) return;

    const material = materials.find(m => m.id === newUsage.materialId);
    if (!material) return;

    const record: UsageRecord = {
      id: Date.now().toString(),
      materialId: newUsage.materialId,
      materialName: material.name,
      quantity: parseFloat(newUsage.quantity),
      client: newUsage.client,
      service: newUsage.service,
      date: new Date().toISOString().split('T')[0],
    };

    setUsageRecords([record, ...usageRecords]);
    
    setMaterials(materials.map(m => 
      m.id === newUsage.materialId 
        ? { ...m, quantity: m.quantity - parseFloat(newUsage.quantity) }
        : m
    ));

    setNewUsage({ materialId: '', quantity: '', client: '', service: '' });
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity || !newMaterial.minQuantity || !newMaterial.category) return;

    const material: Material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      quantity: parseFloat(newMaterial.quantity),
      unit: newMaterial.unit,
      minQuantity: parseFloat(newMaterial.minQuantity),
      category: newMaterial.category,
    };

    setMaterials([...materials, material]);
    setNewMaterial({ name: '', quantity: '', unit: 'мл', minQuantity: '', category: '' });
  };

  const lowStockMaterials = materials.filter(m => m.quantity <= m.minQuantity);
  const totalMaterials = materials.length;
  const totalUsageToday = usageRecords.filter(r => r.date === new Date().toISOString().split('T')[0]).length;

  const categoryStats = materials.reduce((acc, material) => {
    acc[material.category] = (acc[material.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topUsedMaterials = usageRecords
    .reduce((acc, record) => {
      const existing = acc.find(item => item.materialId === record.materialId);
      if (existing) {
        existing.totalQuantity += record.quantity;
        existing.count += 1;
      } else {
        acc.push({
          materialId: record.materialId,
          materialName: record.materialName,
          totalQuantity: record.quantity,
          count: 1,
        });
      }
      return acc;
    }, [] as Array<{ materialId: string; materialName: string; totalQuantity: number; count: number }>)
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <nav className="bg-gradient-primary bg-200 animate-gradient-shift text-white shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">💇‍♀️ BeautyStock</h1>
            <div className="flex gap-2">
              <Button 
                variant={activeTab === 'home' ? 'secondary' : 'ghost'} 
                onClick={() => setActiveTab('home')}
                className="text-white hover:bg-white/20"
              >
                <Icon name="Home" size={18} className="mr-2" />
                Главная
              </Button>
              <Button 
                variant={activeTab === 'usage' ? 'secondary' : 'ghost'} 
                onClick={() => setActiveTab('usage')}
                className="text-white hover:bg-white/20"
              >
                <Icon name="ClipboardList" size={18} className="mr-2" />
                Учет
              </Button>
              <Button 
                variant={activeTab === 'warehouse' ? 'secondary' : 'ghost'} 
                onClick={() => setActiveTab('warehouse')}
                className="text-white hover:bg-white/20"
              >
                <Icon name="Package" size={18} className="mr-2" />
                Склад
              </Button>
              <Button 
                variant={activeTab === 'stats' ? 'secondary' : 'ghost'} 
                onClick={() => setActiveTab('stats')}
                className="text-white hover:bg-white/20"
              >
                <Icon name="BarChart3" size={18} className="mr-2" />
                Статистика
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon name="Package" size={24} className="mr-3" />
                    Всего материалов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold">{totalMaterials}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-secondary text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon name="AlertTriangle" size={24} className="mr-3" />
                    Низкий остаток
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold">{lowStockMaterials.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-accent text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Icon name="TrendingUp" size={24} className="mr-3" />
                    Расход сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold">{totalUsageToday}</p>
                </CardContent>
              </Card>
            </div>

            {lowStockMaterials.length > 0 && (
              <Card className="shadow-lg border-orange-200 bg-orange-50 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800">
                    <Icon name="AlertCircle" size={24} className="mr-3 text-orange-600" />
                    Требуется пополнение
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockMaterials.map(material => (
                      <div key={material.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{material.name}</p>
                          <p className="text-sm text-gray-600">Категория: {material.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="text-sm">
                            {material.quantity} {material.unit}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="History" size={24} className="mr-3 text-purple-600" />
                  Последние операции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageRecords.slice(0, 5).map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{record.materialName}</p>
                        <p className="text-sm text-gray-600">{record.client} • {record.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">-{record.quantity}</p>
                        <p className="text-xs text-gray-500">{record.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Icon name="Plus" size={28} className="mr-3 text-purple-600" />
                  Добавить расход материала
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Материал</Label>
                    <Select value={newUsage.materialId} onValueChange={(value) => setNewUsage({ ...newUsage, materialId: value })}>
                      <SelectTrigger id="material">
                        <SelectValue placeholder="Выберите материал" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} ({material.quantity} {material.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Количество</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Введите количество"
                      value={newUsage.quantity}
                      onChange={(e) => setNewUsage({ ...newUsage, quantity: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="client">Клиент</Label>
                    <Input
                      id="client"
                      placeholder="Имя клиента"
                      value={newUsage.client}
                      onChange={(e) => setNewUsage({ ...newUsage, client: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Услуга</Label>
                    <Input
                      id="service"
                      placeholder="Название услуги"
                      value={newUsage.service}
                      onChange={(e) => setNewUsage({ ...newUsage, service: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleAddUsage} 
                  className="mt-6 w-full bg-gradient-primary hover:opacity-90 text-white"
                  size="lg"
                >
                  <Icon name="Check" size={20} className="mr-2" />
                  Добавить расход
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="List" size={24} className="mr-3 text-purple-600" />
                  История расхода
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {usageRecords.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{record.materialName}</p>
                        <p className="text-sm text-gray-600">{record.client} • {record.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">-{record.quantity}</p>
                        <p className="text-xs text-gray-500">{record.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'warehouse' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90 text-white">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить материал
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новый материал</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-name">Название</Label>
                      <Input
                        id="new-name"
                        placeholder="Название материала"
                        value={newMaterial.name}
                        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-quantity">Количество</Label>
                        <Input
                          id="new-quantity"
                          type="number"
                          value={newMaterial.quantity}
                          onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-unit">Единица</Label>
                        <Select value={newMaterial.unit} onValueChange={(value) => setNewMaterial({ ...newMaterial, unit: value })}>
                          <SelectTrigger id="new-unit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="мл">мл</SelectItem>
                            <SelectItem value="г">г</SelectItem>
                            <SelectItem value="шт">шт</SelectItem>
                            <SelectItem value="листов">листов</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="new-min">Минимальный остаток</Label>
                      <Input
                        id="new-min"
                        type="number"
                        value={newMaterial.minQuantity}
                        onChange={(e) => setNewMaterial({ ...newMaterial, minQuantity: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-category">Категория</Label>
                      <Input
                        id="new-category"
                        placeholder="Окрашивание, Уход и т.д."
                        value={newMaterial.category}
                        onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddMaterial} className="w-full bg-gradient-primary hover:opacity-90 text-white">
                      Добавить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map(material => {
                const stockPercentage = (material.quantity / (material.minQuantity * 3)) * 100;
                const isLow = material.quantity <= material.minQuantity;

                return (
                  <Card key={material.id} className={`shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isLow ? 'border-orange-300 bg-orange-50' : ''}`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{material.name}</span>
                        {isLow && <Icon name="AlertCircle" size={20} className="text-orange-600" />}
                      </CardTitle>
                      <Badge variant="secondary" className="w-fit">{material.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Остаток</span>
                            <span className="font-bold text-lg">{material.quantity} {material.unit}</span>
                          </div>
                          <Progress value={Math.min(stockPercentage, 100)} className="h-2" />
                        </div>
                        <div className="text-xs text-gray-500">
                          Минимум: {material.minQuantity} {material.unit}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PieChart" size={24} className="mr-3 text-purple-600" />
                    Материалы по категориям
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(categoryStats).map(([category, count]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">{category}</span>
                          <Badge className="bg-gradient-primary text-white">{count}</Badge>
                        </div>
                        <Progress value={(count / totalMaterials) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="TrendingUp" size={24} className="mr-3 text-pink-600" />
                    Топ-5 используемых материалов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topUsedMaterials.map((item, index) => (
                      <div key={item.materialId} className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-secondary text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.materialName}</p>
                          <p className="text-sm text-gray-600">{item.count} операций</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-pink-600">{item.totalQuantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Activity" size={24} className="mr-3 text-blue-600" />
                  Общая статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                    <Icon name="Package" size={32} className="mx-auto mb-3 text-purple-600" />
                    <p className="text-3xl font-bold text-purple-700">{totalMaterials}</p>
                    <p className="text-sm text-gray-600 mt-1">Всего позиций</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg">
                    <Icon name="AlertTriangle" size={32} className="mx-auto mb-3 text-orange-600" />
                    <p className="text-3xl font-bold text-orange-700">{lowStockMaterials.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Требуют закупки</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <Icon name="ClipboardList" size={32} className="mx-auto mb-3 text-blue-600" />
                    <p className="text-3xl font-bold text-blue-700">{usageRecords.length}</p>
                    <p className="text-sm text-gray-600 mt-1">Всего операций</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg">
                    <Icon name="Layers" size={32} className="mx-auto mb-3 text-pink-600" />
                    <p className="text-3xl font-bold text-pink-700">{Object.keys(categoryStats).length}</p>
                    <p className="text-sm text-gray-600 mt-1">Категорий</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}