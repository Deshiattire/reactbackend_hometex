import React from 'react'
import Modal from 'react-bootstrap/Modal';
import logo from '../../../assets/img/hometex-logo.png';
import { useState } from 'react';
import { useEffect } from 'react';
import Moment from 'react-moment';

const ShowOrderConfirmation = ({handleOrderPlace, handleOrderSummaryInput, ...props}) => {
    const [branch, setBranch] = useState({})


    useEffect(()=>{
        if(localStorage.branch != undefined){
          setBranch(JSON.parse(localStorage.branch))
      
        }
      },[])
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Order Details Confirmation 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={'order-details-confirmation'}>
        <div className='row px-4r'>
            <div className='col-md-6'>
                {Object.keys(branch).length > 0? 
                <>
                <img src={logo} alt={'Hometex logo'} className={'img-thumbnail w-10'} />
                <p><strong>{branch.name}</strong></p>
                <p><address>{branch.address.address}, {branch.address.area}, {branch.address.district}, {branch.address.division}<br/> 
                Contact: {branch.phone}</address></p>
                </>:null
                }
                
                </div>
            <div className='col-md-6 text-end'>
                <h4>Order Details</h4>
                
            </div>
            <div className='col-md-12 text-end'>
                <p><strong>Date:  
                    <Moment format='DD MMMM, YYYY'>
                        2023/04/01
                    </Moment>
                    </strong></p>
                <h5>Customer Details</h5>
                <p>Name: {props.order_summary.customer.split('-')[0]}</p>
                <p>Phone: {props.order_summary.customer.split('-')[1]}</p>
            </div>
            <div className='col-md-12'>
                <table className='table table-sm table-hover table-bordered table-stripped mt-4'>
                    <thead>
                        <tr>
                        <th>SL</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.keys(props.carts).map((key, index) => (
                        <tr>
                        <td>{++index}</td>
                        <td>{props.carts[key].name}</td>
                        <td>{props.carts[key].quantity}</td>
                        <td>{props.carts[key].original_price}</td>
                        <td className='text-end'>{new Intl.NumberFormat('us').format(props.carts[key].original_price * props.carts[key].quantity)} ৳</td>
                        </tr>
                        ))}
                        <tr>
                        <td colSpan={4} className='text-end'>Sub total</td>
                        <td className='text-end'>{new Intl.NumberFormat('us').format(props.order_summary.amount)} ৳</td>
                        </tr>
                        <tr>
                        <td colSpan={4} className='text-end'>Discount</td>
                        <td className='text-end'>- {new Intl.NumberFormat('us').format(props.order_summary.discount)} ৳</td>
                        </tr>
                        <tr>
                        <th colSpan={4} className='text-end'>Total</th>
                        <th className='text-end'>{new Intl.NumberFormat('us').format(props.order_summary.pay_able)} ৳</th>
                        </tr>
                        <tr>
                        <th colSpan={4} className='text-end align-middle'>Paid Amount</th>
                        <th className='text-end'>
                          <div className='input-group'>
                            <input
                            className="form-control form-control-sm text-end"
                            type={'number'}
                            name={'paid_amount'}
                            value={props.order_summary.paid_amount}
                            onChange={handleOrderSummaryInput}
                            style={{ width:'35px' }}
                            />
                            <div className='input-group-text'>
                            ৳
                            </div>
                          </div>
                          </th>
                        </tr>
                        <tr>
                        <th colSpan={4} className='text-end'>Due Amount</th>
                        <th className='text-end'>{new Intl.NumberFormat('us').format(props.order_summary.due_amount)} ৳</th>
                        </tr>
                        <tr>
                        <th colSpan={4} className='text-end text-theme'>Select Payment Method</th>
                        <th className='text-end'>
                        <select
                            className="form-select form-select-sm text-end"
                            name={'payment_method_id'}
                            value={props.order_summary.payment_method_id}
                            onChange={handleOrderSummaryInput}
                            >
                              {props.paymentMethod.map((payment_method, index)=>(
                                <option value={payment_method.id}>{payment_method.name}</option>
                              ))}
                        </select>
                          </th>
                        </tr>
                        {props.order_summary.payment_method_id != 1 ? 
                        <tr>
                        <th colSpan={4} className='text-end text-theme'>Transaction ID</th>
                        <td className={'align-middle'} style={{ width:'160px' }}>
                        <input
                          className="form-control form-control-sm text-end"
                          type={'text'}
                          name={'trx_id'}
                          value={props.order_summary.trx_id}
                          onChange={handleOrderSummaryInput}                            
                          />
                        </td>
                      </tr> : null  
                      }
                        
                    </tbody>
                </table>
            </div>
        </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='px-4'>
        <button className={'btn btn-sm btn-danger'} onClick={props.onHide}>Close</button>
        <button onClick={handleOrderPlace} className={"btn btn-sm theme-button ms-3"}
                          dangerouslySetInnerHTML={{ __html: props.is_loading ? '<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...' : 'Confirm' }}
                        />
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ShowOrderConfirmation