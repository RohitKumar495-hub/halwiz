import Link from 'next/link';
import React from 'react'
import { MdBackspace } from 'react-icons/md';

type CartModalProps = {
  close: () => void
}

const CartModal = ({ close }: CartModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button
          onClick={close}
          className="px-4 py-2 rounded cursor-pointer absolute -top-10 right-0 text-white"
        >
          <MdBackspace size={20}/>
        </button>
        <h2 className="text-xl font-semibold mb-4">Product was successfully added to your cart.</h2>
        <div className='flex gap-6 items-center justify-center'>
            <Link href={"/shop"} className='bg-[#eded21] px-2 py-2 rounded text-sm font-semibold'>Continue Shopping</Link>
            <Link href={"/cart"} className='bg-[#f5a70c] px-2 py-2 rounded text-white text-sm font-semibold'>View Cart</Link>
        </div>
      </div>
    </div>
  )
}

export default CartModal
