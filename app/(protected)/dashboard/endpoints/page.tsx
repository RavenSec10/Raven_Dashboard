'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import EndpointFilters from '@/components/ui/endpointSearch';
import { getFromLocalStorage, setToLocalStorage } from '@/data/localStorage';
import { lusitana } from '@/components/ui/fonts';

interface Headers {
    [key: string]: string;
}

interface PIIFinding {
    pii_type: string;
    detected_value: string;
    field_name: string;
    location: string;
    detection_mode: string;
    risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    tags: string[];
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
    entryType: string;
    url: string | null;
    pii_findings?: PIIFinding[];
    risk_level?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    sensitive_fields?: string[];
}

interface PaginatedResponse {
    items: UserAPIData[];
    total: number;
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

function extractHostname(url: string | null): string {
    try {
        if (!url) {
            return "No URL provided";
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            console.warn("URL is not absolute:", url);
            return "Invalid URL";
        }
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch (error: any) {
        console.error("Error parsing URL:", url, error.message);
        return "Unknown Host";
    }
}

function truncatePath(path: string, maxLength: number): string {
    if (path.length <= maxLength) {
        return path;
    }
    return path.substring(0, maxLength) + "...";
}

const getMethodColor = (method: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2";
    switch (method.toUpperCase()) {
        case 'GET': return `${baseClasses} bg-green-500/20 text-green-300 border border-green-400`;
        case 'POST': return `${baseClasses} bg-blue-500/20 text-blue-300 border border-blue-400`;
        case 'PUT': return `${baseClasses} bg-yellow-500/20 text-yellow-300 border border-yellow-400`;
        case 'DELETE': return `${baseClasses} bg-red-500/20 text-red-300 border border-red-400`;
        case 'PATCH': return `${baseClasses} bg-purple-500/20 text-purple-300 border border-purple-400`;
        default: return `${baseClasses} bg-gray-600/30 text-gray-300 border border-gray-500`;
    }
};

const getRiskLevelColor = (riskLevel: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (riskLevel?.toUpperCase()) {
        case 'CRITICAL': return `${baseClasses} bg-red-500/25 text-red-200 border border-red-400`;
        case 'HIGH': return `${baseClasses} bg-orange-500/25 text-orange-200 border border-orange-400`;
        case 'MEDIUM': return `${baseClasses} bg-yellow-500/25 text-yellow-200 border border-yellow-400`;
        case 'LOW': return `${baseClasses} bg-green-500/25 text-green-200 border border-green-400`;
        default: return `${baseClasses} bg-gray-600/30 text-gray-300 border border-gray-500`;
    }
};

const getSensitiveDataClasses = (sensitiveFields?: string[]): string[] => {
    if (!sensitiveFields || sensitiveFields.length === 0) return [];
    return sensitiveFields;
};

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function EndpointsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1'));
    const [limit, setLimit] = useState(() => parseInt(searchParams.get('limit') || '10'));
    const [searchEndpoint, setSearchEndpoint] = useState(() => searchParams.get('searchEndpoint') || '');
    const [searchHostname, setSearchHostname] = useState(() => searchParams.get('searchHostname') || '');
    const [methodFilter, setMethodFilter] = useState(() => searchParams.get('methodFilter') || '');
    const [riskLevelFilter, setRiskLevelFilter] = useState(() => searchParams.get('riskLevelFilter') || '');
    const [sensitiveDataFilter, setSensitiveDataFilter] = useState(() => searchParams.get('sensitiveDataFilter') || '');
    
    const [harEntries, setHarEntries] = useState<UserAPIData[]>([]);
    const [allEntries, setAllEntries] = useState<UserAPIData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalEntries, setTotalEntries] = useState(0);
    
    const MAX_PATH_LENGTH = 50;
    const debouncedSearchEndpoint = useDebounce(searchEndpoint, 300);
    const debouncedSearchHostname = useDebounce(searchHostname, 300);
    const debouncedMethodFilter = useDebounce(methodFilter, 300);
    const debouncedRiskLevelFilter = useDebounce(riskLevelFilter, 300);
    const debouncedSensitiveDataFilter = useDebounce(sensitiveDataFilter, 300);
    const totalPages = Math.ceil(totalEntries / limit);

    useEffect(() => {
        setIsClient(true);
        if (!searchParams.get('page')) {
            setPage(parseInt(getFromLocalStorage('endpointsPage', '1')));
        }
        if (!searchParams.get('limit')) {
            setLimit(parseInt(getFromLocalStorage('endpointsLimit', '10')));
        }
        if (!searchParams.get('searchEndpoint')) {
            setSearchEndpoint(getFromLocalStorage('endpointsSearchEndpoint', ''));
        }
        if (!searchParams.get('searchHostname')) {
            setSearchHostname(getFromLocalStorage('endpointsSearchHostname', ''));
        }
        if (!searchParams.get('methodFilter')) {
            setMethodFilter(getFromLocalStorage('endpointsMethodFilter', ''));
        }
        if (!searchParams.get('riskLevelFilter')) {
            setRiskLevelFilter(getFromLocalStorage('endpointsRiskLevelFilter', ''));
        }
        if (!searchParams.get('sensitiveDataFilter')) {
            setSensitiveDataFilter(getFromLocalStorage('endpointsSensitiveDataFilter', ''));
        }
    }, [searchParams]);

    const filteredEntries = useMemo(() => {
        return allEntries.filter(entry => {
            const matchesEndpoint = !debouncedSearchEndpoint || 
                entry.api_endpoint.toLowerCase().includes(debouncedSearchEndpoint.toLowerCase());
                
            const hostname = extractHostname(entry.url);
            const matchesHostname = !debouncedSearchHostname || 
                hostname.toLowerCase().includes(debouncedSearchHostname.toLowerCase());
                
            const matchesMethod = !debouncedMethodFilter || 
                entry.method.toUpperCase() === debouncedMethodFilter.toUpperCase();
                
            const matchesRiskLevel = !debouncedRiskLevelFilter || 
                entry.risk_level?.toUpperCase() === debouncedRiskLevelFilter.toUpperCase();
                
            const sensitiveDataClasses = getSensitiveDataClasses(entry.sensitive_fields);
            const matchesSensitiveData = !debouncedSensitiveDataFilter || 
                sensitiveDataClasses.some(cls => cls.toLowerCase().includes(debouncedSensitiveDataFilter.toLowerCase()));
                
            return matchesEndpoint && matchesHostname && matchesMethod && matchesRiskLevel && matchesSensitiveData;
        });
    }, [allEntries, debouncedSearchEndpoint, debouncedSearchHostname, debouncedMethodFilter, debouncedRiskLevelFilter, debouncedSensitiveDataFilter]);

    const paginatedEntries = useMemo(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return filteredEntries.slice(startIndex, endIndex);
    }, [filteredEntries, page, limit]);

    useEffect(() => {
        if (!isClient) return;
        setToLocalStorage('endpointsPage', page.toString());
        setToLocalStorage('endpointsLimit', limit.toString());
        setToLocalStorage('endpointsSearchEndpoint', debouncedSearchEndpoint);
        setToLocalStorage('endpointsSearchHostname', debouncedSearchHostname);
        setToLocalStorage('endpointsMethodFilter', debouncedMethodFilter);
        setToLocalStorage('endpointsRiskLevelFilter', debouncedRiskLevelFilter);
        setToLocalStorage('endpointsSensitiveDataFilter', debouncedSensitiveDataFilter);
        
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('limit', limit.toString());
        
        if (debouncedSearchEndpoint) params.set('searchEndpoint', debouncedSearchEndpoint);
        if (debouncedSearchHostname) params.set('searchHostname', debouncedSearchHostname);
        if (debouncedMethodFilter) params.set('methodFilter', debouncedMethodFilter);
        if (debouncedRiskLevelFilter) params.set('riskLevelFilter', debouncedRiskLevelFilter);
        if (debouncedSensitiveDataFilter) params.set('sensitiveDataFilter', debouncedSensitiveDataFilter);
        
        const newUrl = `/dashboard/endpoints?${params.toString()}`;
        if (window.location.pathname + window.location.search !== newUrl) {
            router.replace(newUrl);
        }
    }, [page, limit, debouncedSearchEndpoint, debouncedSearchHostname, debouncedMethodFilter, debouncedRiskLevelFilter, debouncedSensitiveDataFilter, router, isClient]);

    useEffect(() => {
        setTotalEntries(filteredEntries.length);
    }, [filteredEntries]);

    useEffect(() => {
        setHarEntries(paginatedEntries);
    }, [paginatedEntries]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(event.target.value);
        setLimit(newLimit);
        setPage(1);
    };

    const handleSearchEndpointChange = useCallback((value: string) => {
        setSearchEndpoint(value);
        setPage(1);
    }, []);

    const handleSearchHostnameChange = useCallback((value: string) => {
        setSearchHostname(value);
        setPage(1);
    }, []);

    const handleMethodFilterChange = useCallback((value: string) => {
        setMethodFilter(value);
        setPage(1);
    }, []);

    const handleRiskLevelFilterChange = useCallback((value: string) => {
        setRiskLevelFilter(value);
        setPage(1);
    }, []);

    const handleSensitiveDataFilterChange = useCallback((value: string) => {
        setSensitiveDataFilter(value);
        setPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchEndpoint('');
        setSearchHostname('');
        setMethodFilter('');
        setRiskLevelFilter('');
        setSensitiveDataFilter('');
        setPage(1);
    }, []);

    const handleRowClick = (entryId: string) => {
        const params = new URLSearchParams();
        params.set('returnPage', page.toString());
        params.set('returnLimit', limit.toString());
        if (searchEndpoint) params.set('returnSearchEndpoint', searchEndpoint);
        if (searchHostname) params.set('returnSearchHostname', searchHostname);
        if (methodFilter) params.set('returnMethodFilter', methodFilter);
        if (riskLevelFilter) params.set('returnRiskLevelFilter', riskLevelFilter);
        if (sensitiveDataFilter) params.set('returnSensitiveDataFilter', sensitiveDataFilter);
        
        router.push(`/dashboard/endpoints/${entryId}?${params.toString()}`);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<PaginatedResponse>(
                    `http://localhost:8080/api/har-entries?page=1&limit=100`
                );
                
                const entriesWithTypes: UserAPIData[] = response.data.items.map((entry: any) => ({
                    ...entry,
                    entryType: determineEntryType(entry.api_endpoint),
                }));
                
                setAllEntries(entriesWithTypes);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch HAR entries');
                setLoading(false);
                console.error('Error fetching HAR entries:', err);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="text-center text-gray-300">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                    Loading HAR entries...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 p-6">
                <div className="text-red-400 text-center p-4 bg-red-900/20 border border-red-800 rounded-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className={`${lusitana.className} text-3xl font-semibold text-red-400`}>Endpoints</h1>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Show</span>
                    <select 
                        className="bg-slate-800 border border-gray-700 text-gray-300 rounded px-4 py-1 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        value={limit}
                        onChange={handleLimitChange}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-400">entries</span>
                </div>
            </div>
            
            <EndpointFilters
                searchEndpoint={searchEndpoint}
                searchHostname={searchHostname}
                methodFilter={methodFilter}
                riskLevelFilter={riskLevelFilter}
                sensitiveDataFilter={sensitiveDataFilter}
                onSearchEndpointChange={handleSearchEndpointChange}
                onSearchHostnameChange={handleSearchHostnameChange}
                onMethodFilterChange={handleMethodFilterChange}
                onRiskLevelFilterChange={handleRiskLevelFilterChange}
                onSensitiveDataFilterChange={handleSensitiveDataFilterChange}
                onClearFilters={handleClearFilters}
            />
            
            <div className="overflow-x-auto mb-6 bg-slate-800 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Path</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Host</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sensitive Data Classes</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Level</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">First Detected</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-gray-700">
                        {harEntries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="text-6xl mb-2">😔</div>
                                        <div>No search results found</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            harEntries.map((entry) => {
                                const sensitiveDataClasses = getSensitiveDataClasses(entry.sensitive_fields);
                                return (
                                    <tr key={entry.id}
                                        className="hover:bg-slate-700/50 transition-colors group cursor-pointer"
                                        onClick={() => handleRowClick(entry.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 group-hover:text-red-400">
                                            <div className="relative">
                                                <span title={`${entry.method} ${entry.api_endpoint}`}>
                                                    <span className={`${getMethodColor(entry.method)}`}>
                                                        {entry.method}
                                                    </span>
                                                    <span className="font-mono">
                                                        {truncatePath(entry.api_endpoint, MAX_PATH_LENGTH - entry.method.length - 1)}
                                                    </span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 group-hover:text-red-400">
                                            {extractHostname(entry.url)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 group-hover:text-red-400">
                                            <div className="flex flex-wrap gap-1">
                                                {sensitiveDataClasses.length > 0 ? (
                                                    sensitiveDataClasses.slice(0, 3).map((dataClass, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/25 text-red-200 border border-red-400"
                                                        >
                                                            {dataClass}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-xs">No sensitive data detected</span>
                                                )}
                                                {sensitiveDataClasses.length > 3 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-400 border border-gray-700">
                                                        +{sensitiveDataClasses.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={getRiskLevelColor(entry.risk_level || 'NONE')}>
                                                {entry.risk_level || 'NONE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 group-hover:text-red-400">
                                            {entry.timestamp}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                    Showing {harEntries.length} of {totalEntries} entries
                    {(searchEndpoint || searchHostname || methodFilter || riskLevelFilter || sensitiveDataFilter) && (
                        <span className="ml-2 text-red-400">
                            (filtered)
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-center space-x-1">
                    <button 
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                            page === 1 
                                ? 'bg-slate-700/50 text-gray-500 border border-slate-600/50 cursor-not-allowed' 
                                : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10'
                        }`}
                        title="Go to first page"
                    >
                        <span>&laquo; First</span>
                    </button>

                    <button 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                            page === 1 
                                ? 'bg-slate-700/50 text-gray-500 border border-slate-600/50 cursor-not-allowed' 
                                : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10'
                        }`}
                        title="Go to previous page"
                    >
                        <span>&lsaquo; Prev</span>
                    </button>

                    <div className="px-4 py-2 mx-2 bg-slate-800/80 border border-slate-600 rounded-lg">
                        <span className="text-sm font-medium text-gray-300">
                            Page <span className="text-red-400 font-semibold">{page}</span> of <span className="text-red-400 font-semibold">{totalPages || 1}</span>
                        </span>
                    </div>
                    
                    <button 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                            page >= totalPages 
                                ? 'bg-slate-700/50 text-gray-500 border border-slate-600/50 cursor-not-allowed' 
                                : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10'
                        }`}
                        title="Go to next page"
                    >
                        <span>Next &rsaquo;</span>
                    </button>

                    <button 
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page >= totalPages}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                            page >= totalPages 
                                ? 'bg-slate-700/50 text-gray-500 border border-slate-600/50 cursor-not-allowed' 
                                : 'bg-slate-800 text-gray-300 border border-slate-600 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10'
                        }`}
                        title="Go to last page"
                    >
                        <span>Last &raquo;</span>
                    </button>
                </div>
            </div>
        </div>
    );
}