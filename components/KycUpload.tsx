'use client';
import React from 'react';
type Props={ docType?: 'id'|'passport'|'driver' }
export default function KycUpload({docType='id'}:Props){ return <div>KYC Upload: {docType}</div>; }
