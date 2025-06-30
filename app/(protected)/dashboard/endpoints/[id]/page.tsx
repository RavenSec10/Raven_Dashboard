'use client';
import React, { useState, useEffect } from 'react';
import { lusitana } from '@/components/ui/fonts';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle,  
  Code, 
  Database,
  Activity,
  TrendingUp,
  Eye,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Headers {
  [key: string]: string;
}

interface PIIFinding {
  PIIType: string;
  DetectedValue: string;
  RiskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  Category: string;
  Tags: string[];
}

interface UserAPIData {
  id: string;
  api_endpoint: string;
  method: string;
  headers: Headers | null;
  request_body: string;
  response_body: string;
  timestamp: string;
  source: string;
  url: string | null;
  entryType?: string;
  pii_findings?: PIIFinding[];
  risk_level?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sensitive_fields?: string[];
}

function determineEntryType(apiEndpoint: string): string {
  if (apiEndpoint.includes('.')) {
    return "Web Directory";
  }
  if (apiEndpoint.includes('?') || apiEndpoint.includes('=')) {
    return "API With Parameters";
  }
  return "API Endpoint";
}

const formatJSON = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return jsonString || "Invalid JSON";
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'CRITICAL': return 'bg-red-600 hover:bg-red-700';
    case 'HIGH': return 'bg-red-500 hover:bg-red-600';
    case 'MEDIUM': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'LOW': return 'bg-green-500 hover:bg-green-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-green-600';
    case 'POST': return 'bg-blue-600';
    case 'PUT': return 'bg-yellow-600';
    case 'DELETE': return 'bg-red-600';
    case 'PATCH': return 'bg-purple-600';
    default: return 'bg-gray-600';
  }
};

const getRiskColorForChart = (risk: string) => {
  switch (risk) {
    case 'CRITICAL': return '#dc2626';
    case 'HIGH': return '#ea580c';
    case 'MEDIUM': return '#ca8a04';
    case 'LOW': return '#16a34a';
    default: return '#6b7280';
  }
};

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  
  if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent) {
    return null;
  }
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const generateChartData = (data: UserAPIData) => {
  const riskCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

  if (data.pii_findings && Array.isArray(data.pii_findings) && data.pii_findings.length > 0) {
    data.pii_findings.forEach(finding => {
      if (finding && typeof finding === 'object' && finding.RiskLevel) {
        const riskLevel = finding.RiskLevel.toUpperCase();
        if (riskLevel in riskCounts) {
          riskCounts[riskLevel as keyof typeof riskCounts]++;
        }
      }
    });
  }

  const totalFindings = Object.values(riskCounts).reduce((sum, count) => sum + count, 0);

  const riskData = totalFindings > 0 ? Object.entries(riskCounts)
    .filter(([_, count]) => count > 0)
    .map(([risk, count]) => ({
      name: risk,
      value: count,
      percentage: ((count / totalFindings) * 100).toFixed(0),
      color: getRiskColorForChart(risk)
    })) : [];

  const headerTypes = data.headers && typeof data.headers === 'object' 
    ? Object.keys(data.headers).reduce((acc, key) => {
        const category = key.toLowerCase().includes('auth') ? 'Authentication' :
                        key.toLowerCase().includes('content') ? 'Content' :
                        key.toLowerCase().includes('accept') ? 'Accept' :
                        key.toLowerCase().includes('user') ? 'User Info' : 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) 
    : {};

  const headerData = Object.entries(headerTypes).map(([key, value]) => ({
    name: key,
    count: value,
    color: key === 'Authentication' ? '#dc2626' : 
           key === 'Content' ? '#2563eb' : 
           key === 'Accept' ? '#16a34a' : 
           key === 'User Info' ? '#ca8a04' : '#6b7280'
  }));

  const timelineData = [
    { time: '00:00', requests: 12, responses: 11 },
    { time: '06:00', requests: 19, responses: 18 },
    { time: '12:00', requests: 25, responses: 24 },
    { time: '18:00', requests: 31, responses: 29 },
    { time: '24:00', requests: 18, responses: 17 }
  ];

  return { riskData, headerData, timelineData, totalFindings };
};

export default function EndpointDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = params;
  const [endpointData, setEndpointData] = useState<UserAPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const returnPage = searchParams.get('returnPage') || '1';
  const returnLimit = searchParams.get('returnLimit') || '10';
  const returnSearchEndpoint = searchParams.get('returnSearchEndpoint') || '';
  const returnSearchHostname = searchParams.get('returnSearchHostname') || '';
  const returnMethodFilter = searchParams.get('returnMethodFilter') || '';

  const handleBackToEndpoints = () => {
    const params = new URLSearchParams();
    params.set('page', returnPage);
    params.set('limit', returnLimit);
    
    if (returnSearchEndpoint) params.set('searchEndpoint', returnSearchEndpoint);
    if (returnSearchHostname) params.set('searchHostname', returnSearchHostname);
    if (returnMethodFilter) params.set('methodFilter', returnMethodFilter);
    
    router.push(`/dashboard/endpoints?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/api/har-entries/${id}`);
        if (!response.data || !response.data.items || !response.data.items[0]) {
          throw new Error('Invalid response format from server or entry not found');
        }
        const entry = response.data.items[0];
        const entryWithType = {
          ...entry,
          entryType: determineEntryType(entry.api_endpoint)
        };
        
        setEndpointData(entryWithType);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch endpoint details');
        setLoading(false);
        console.error('Error fetching endpoint details:', err);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading endpoint details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!endpointData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Server className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-300 text-xl">Endpoint not found</p>
        </div>
      </div>
    );
  }

  const formattedJSON = formatJSON(JSON.stringify(endpointData));
  const chartData = generateChartData(endpointData);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
                onClick={handleBackToEndpoints}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-slate-300 hover:text-red-400 hover:bg-slate-600 transition-all group"
                >
                <ArrowLeft
                    strokeWidth={2.5}
                    className="w-5 h-5 text-slate-300 group-hover:text-red-400 group-hover:-translate-x-1 transition-transform duration-200"
                />
                <span className={`${lusitana.className} text-lg font-medium`}>Return</span>
            </button>

            <div className="h-6 w-px bg-slate-600"></div>
            <h1 className={`${lusitana.className} text-2xl font-bold text-red-400`}>
              Endpoint Analysis
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge
                className={`
                ${getMethodColor(endpointData.method)} text-white rounded-full px-3 py-1 text-xs font-semibold shadow-sm tracking-wide transition-all duration-200 hover:brightness-110`}
            >
                {endpointData.method}
            </Badge>

            <Badge
                className={`
                ${getRiskColor(endpointData.risk_level || 'LOW')} text-white rounded-full px-3 py-1 text-xs font-semibold shadow-md tracking-wide transition-all duration-200 animate-blink`}
            >
                {(endpointData.risk_level || 'LOW')} RISK
            </Badge>
          </div>

        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Risk Level</p>
                  <p className="text-2xl font-bold text-red-400">{endpointData.risk_level || 'LOW'}</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Method</p>
                  <p className="text-2xl font-bold text-blue-400">{endpointData.method}</p>
                </div>
                <Code className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Headers</p>
                  <p className="text-2xl font-bold text-green-400">
                    {endpointData.headers ? Object.keys(endpointData.headers).length : 0}
                  </p>
                </div>
                <Database className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">PII Findings</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {endpointData.pii_findings?.length || 0}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:w-1/2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <span>Security Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="risk" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                    <TabsTrigger value="risk" className="data-[state=active]:bg-red-600">Risk</TabsTrigger>
                    <TabsTrigger value="headers" className="data-[state=active]:bg-red-600">Headers</TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-red-600">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="risk" className="mt-6">
                    <div className="h-64">
                      {chartData.totalFindings > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData.riskData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={80}
                              innerRadius={0}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="#475569"
                              strokeWidth={1}
                            >
                              {chartData.riskData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid #475569',
                                borderRadius: '8px',
                                color: '#f1f5f9'
                              }}
                              formatter={(value: number, name: string) => [
                                `${value} finding${value !== 1 ? 's' : ''} (${((value / chartData.totalFindings) * 100).toFixed(0)}%)`,
                                `${name} Risk`
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Shield className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                            <p className="text-slate-400">No PII findings detected</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {chartData.totalFindings > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Risk Distribution:</h4>
                        {chartData.riskData.map((risk, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: risk.color }}
                              ></div>
                              <span className="text-slate-300">{risk.name}</span>
                            </div>
                            <span className="text-slate-400">{risk.value} finding{risk.value !== 1 ? 's' : ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="headers" className="mt-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.headerData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px',
                              color: '#f1f5f9'
                            }} 
                          />
                          <Bar dataKey="count" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.timelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                          <XAxis dataKey="time" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px',
                              color: '#f1f5f9'
                            }} 
                          />
                          <Line type="monotone" dataKey="requests" stroke="#ef4444" strokeWidth={2} />
                          <Line type="monotone" dataKey="responses" stroke="#22c55e" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Activity className="w-5 h-5 text-red-500" />
                  <span>Endpoint Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <label className="text-sm font-medium text-slate-400">Endpoint URL</label>
                    <p className="text-slate-100 break-all font-mono text-sm mt-1">
                      {endpointData.api_endpoint}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <label className="text-sm font-medium text-slate-400">Source</label>
                    <p className="text-slate-100 mt-1">{endpointData.source}</p>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <label className="text-sm font-medium text-slate-400">Timestamp</label>
                    <p className="text-slate-100 mt-1">{new Date(endpointData.timestamp).toLocaleString()}</p>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <label className="text-sm font-medium text-slate-400">Entry Type</label>
                    <p className="text-slate-100 mt-1">{endpointData.entryType}</p>
                  </div>

                  {endpointData.sensitive_fields && (
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <label className="text-sm font-medium text-slate-400">Sensitive Fields</label>
                      <p className="text-slate-100 mt-1">{endpointData.sensitive_fields}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full xl:w-1/2">
            <Card className="bg-slate-800 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-100">
                  <Code className="w-5 h-5 text-red-500" />
                  <span>Raw JSON Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[900px] overflow-hidden">
                  <SyntaxHighlighter 
                    style={dracula} 
                    language="json" 
                    wrapLongLines={true}
                    showLineNumbers={true}
                    customStyle={{
                      borderRadius: '0 0 8px 8px',
                      fontSize: '13px',
                      margin: 0,
                      height: '100%',
                      overflow: 'auto',
                      backgroundColor: '#0f172a'
                    }}
                    codeTagProps={{
                      style: {
                        display: 'block',
                        width: '100%',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap'
                      }
                    }}
                  >
                    {formattedJSON}
                  </SyntaxHighlighter>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}