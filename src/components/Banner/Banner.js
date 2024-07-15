import React from 'react';
import banner1 from '../../images/banner3.jpg';
import banner2 from '../../images/banner4.jpg';
import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
    return (
        <div className="flex flex-col mt-10 md:flex-row">
            <div className="w-full md:w-1/2 p-2">
                <Link href="/pages/freshdeals">
                 
                        <Image src={banner1} alt="Banner 1" layout="responsive" width={1000} height={1000} className="w-full h-auto" />
               
                </Link>
            </div>
            <div className="w-full md:w-1/2 p-2">
                <Link href="/pages/freshdeals">
              
                        <Image src={banner2} alt="Banner 2" layout="responsive" width={500} height={1000} className="w-full h-auto" />
    
                </Link>
            </div>
        </div>
    );
};

export default Banner;
