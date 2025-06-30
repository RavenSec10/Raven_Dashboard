'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface EndpointFiltersProps {
  searchEndpoint: string;
  searchHostname: string;
  methodFilter: string;
  riskLevelFilter: string;
  sensitiveDataFilter: string;
  onSearchEndpointChange: (value: string) => void;
  onSearchHostnameChange: (value: string) => void;
  onMethodFilterChange: (value: string) => void;
  onRiskLevelFilterChange: (value: string) => void;
  onSensitiveDataFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const getMethodColor = (method: string) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2";
  switch (method.toUpperCase()) {
    case 'GET': return `${baseClasses} bg-green-900/20 text-green-400 border border-green-800`;
    case 'POST': return `${baseClasses} bg-blue-900/20 text-blue-400 border border-blue-800`;
    case 'PUT': return `${baseClasses} bg-yellow-900/20 text-yellow-400 border border-yellow-800`;
    case 'DELETE': return `${baseClasses} bg-red-900/20 text-red-400 border border-red-800`;
    case 'PATCH': return `${baseClasses} bg-purple-900/20 text-purple-400 border border-purple-800`;
    case 'HEAD': return `${baseClasses} bg-gray-800/50 text-gray-400 border border-gray-700`;
    default: return `${baseClasses} bg-gray-800/50 text-gray-400 border border-gray-700`;
  }
};

const getRiskLevelColor = (riskLevel: string) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2";
  switch (riskLevel.toUpperCase()) {
    case 'CRITICAL': return `${baseClasses} bg-red-900/30 text-red-400 border border-red-800`;
    case 'HIGH': return `${baseClasses} bg-orange-900/30 text-orange-400 border border-orange-800`;
    case 'MEDIUM': return `${baseClasses} bg-yellow-900/30 text-yellow-400 border border-yellow-800`;
    case 'LOW': return `${baseClasses} bg-green-900/30 text-green-400 border border-green-800`;
    default: return `${baseClasses} bg-gray-800/50 text-gray-400 border border-gray-700`;
  }
};

export default function EndpointFilters({
  searchEndpoint,
  searchHostname,
  methodFilter,
  riskLevelFilter,
  sensitiveDataFilter,
  onSearchEndpointChange,
  onSearchHostnameChange,
  onMethodFilterChange,
  onRiskLevelFilterChange,
  onSensitiveDataFilterChange,
  onClearFilters
}: EndpointFiltersProps) {
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
  const riskLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const endpointInputRef = useRef<HTMLInputElement>(null);
  const hostnameInputRef = useRef<HTMLInputElement>(null);
  const sensitiveDataInputRef = useRef<HTMLInputElement>(null);
  const lastFocusedInput = useRef<'endpoint' | 'hostname' | 'sensitiveData' | null>(null);

  useEffect(() => {
    if (lastFocusedInput.current === 'endpoint' && endpointInputRef.current) {
      const input = endpointInputRef.current;
      const length = input.value.length;
      input.focus();
      input.setSelectionRange(length, length);
    } else if (lastFocusedInput.current === 'hostname' && hostnameInputRef.current) {
      const input = hostnameInputRef.current;
      const length = input.value.length;
      input.focus();
      input.setSelectionRange(length, length);
    } else if (lastFocusedInput.current === 'sensitiveData' && sensitiveDataInputRef.current) {
      const input = sensitiveDataInputRef.current;
      const length = input.value.length;
      input.focus();
      input.setSelectionRange(length, length);
    }
  });

  const handleEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastFocusedInput.current = 'endpoint';
    onSearchEndpointChange(e.target.value);
  };

  const handleHostnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastFocusedInput.current = 'hostname';
    onSearchHostnameChange(e.target.value);
  };

  const handleSensitiveDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    lastFocusedInput.current = 'sensitiveData';
    onSensitiveDataFilterChange(e.target.value);
  };

  const handleEndpointFocus = () => {
    lastFocusedInput.current = 'endpoint';
  };

  const handleHostnameFocus = () => {
    lastFocusedInput.current = 'hostname';
  };

  const handleSensitiveDataFocus = () => {
    lastFocusedInput.current = 'sensitiveData';
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== endpointInputRef.current &&
          document.activeElement !== hostnameInputRef.current &&
          document.activeElement !== sensitiveDataInputRef.current) {
        lastFocusedInput.current = null;
      }
    }, 100);
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-gray-700 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search by Endpoint */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search by Endpoint
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={endpointInputRef}
              type="text"
              placeholder="Search endpoints..."
              value={searchEndpoint}
              onChange={handleEndpointChange}
              onFocus={handleEndpointFocus}
              onBlur={handleInputBlur}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-gray-600 text-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Search by Hostname */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search by Hostname
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={hostnameInputRef}
              type="text"
              placeholder="Search hostnames..."
              value={searchHostname}
              onChange={handleHostnameChange}
              onFocus={handleHostnameFocus}
              onBlur={handleInputBlur}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-gray-600 text-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter by Method */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter by Method
          </label>
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className="group w-full bg-slate-700 border border-gray-600 rounded-md py-2 px-3 flex items-center justify-between text-sm font-medium text-gray-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors">
                  <span>{methodFilter || 'All Methods'}</span>
                  <ChevronDown
                    className={`${open ? 'rotate-180' : ''} ml-2 h-5 w-5 text-gray-400 transition-transform`}
                    aria-hidden="true"
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-slate-800 border border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <button
                        onClick={() => onMethodFilterChange('')}
                        className="text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                      >
                        All Methods
                      </button>
                      {httpMethods.map((method) => (
                        <button
                          key={method}
                          onClick={() => onMethodFilterChange(method)}
                          className="text-gray-300 w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center"
                        >
                          <span className={getMethodColor(method)}>
                            {method}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>

        {/* Filter by Risk Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter by Risk Level
          </label>
          <Popover className="relative">
            {({ open }) => (
              <>
                <Popover.Button className="group w-full bg-slate-700 border border-gray-600 rounded-md py-2 px-3 flex items-center justify-between text-sm font-medium text-gray-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors">
                  <span>{riskLevelFilter || 'All Risk Levels'}</span>
                  <ChevronDown
                    className={`${open ? 'rotate-180' : ''} ml-2 h-5 w-5 text-gray-400 transition-transform`}
                    aria-hidden="true"
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 mt-1 w-full rounded-md shadow-lg bg-slate-800 border border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <button
                        onClick={() => onRiskLevelFilterChange('')}
                        className="text-gray-300 block w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors"
                      >
                        All Risk Levels
                      </button>
                      {riskLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => onRiskLevelFilterChange(level)}
                          className="text-gray-300 w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center"
                        >
                          <span className={getRiskLevelColor(level)}>
                            {level}
                          </span>
                        </button>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>

        {/* Search by Sensitive Data */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Search Sensitive Data
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={sensitiveDataInputRef}
              type="text"
              placeholder="Search data types..."
              value={sensitiveDataFilter}
              onChange={handleSensitiveDataChange}
              onFocus={handleSensitiveDataFocus}
              onBlur={handleInputBlur}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-gray-600 text-gray-300 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {(searchEndpoint || searchHostname || methodFilter || riskLevelFilter || sensitiveDataFilter) && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors border border-gray-700 hover:border-red-800"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}