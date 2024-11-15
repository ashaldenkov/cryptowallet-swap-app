import './style/index.scss';
import React, { useEffect, useState } from 'react';
import { TokenSelector } from './component/TokenSelector';
import { useFetch } from './hooks/useBalanceAndPriceFetch'
import { usePost } from './hooks/useSwapPost'
import LoadingDot from './component/LoadingDot';

const Main: React.FC = () => {
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState('');

  const [payToken, setPayToken] = useState('CTC');
  const [receiveToken, setReceiveToken] = useState('');

  const [payInputValue, setPayInputValue] = useState('')

  const { balance, price, isLoading, error } = useFetch();


  // changing token icon for selected one
  const selectedToken = (token?: string) => {
    if (token) {
      if (token === 'CTC') {
        return (
          <>
            <div className="token CTC" data-token-size="28"></div>
            <strong className="name">CTC</strong>
          </>
        )
      } else if (token === 'USDC') {
        return (
          <>
            <div className="token USDC" data-token-size="28"></div>
            <strong className="name">USDC</strong>
          </>
        )
      } else if (token === 'USDT') {
        return (
          <>
            <div className="token USDT" data-token-size="28"></div>
            <strong className="name">USDT</strong>
          </>
        )
      } else if (token === 'WCTC') {
        return (
          <>
            <div className="token WCTC" data-token-size="28"></div>
            <strong className="name">WCTC</strong>
          </>
        )
      }
    }
    return (
      <>
        Select token
      </>
    )
  }


  // for swapping tokens by clicking the arrow in the center of the screen
  // NOT swapping input values because it wasn't required 
  const swapPayAndReceive = () => {
    if (receiveToken) {
      const payTokenTemp = payToken
      const receiveTokenTemp = receiveToken
      setPayToken(receiveTokenTemp) // swap first
      setReceiveToken(payTokenTemp) // swap second
    }
    return
  }


  const calculationFormula = () => {
    // * Total Value of ’You pay’ = (Amount of ’You pay’ currency) * (Value of ’You pay’ currency)
    const youPay = Number(payInputValue) * price?.[payToken]
    // * Amount of ’You receive’ = Total Value of ’You pay’ / Value of ’You receive’
    const youReceive = youPay / price?.[receiveToken]

    //rounding number if needed
    return Math.floor(youReceive * 10000) / 10000
  }

  const { response, fetchData, isPending } = usePost()

  useEffect(() => {
    setPayInputValue('')
  }, [response])

  return (
    <>
      <div>
        <section className="page swap-page">
          <div className="box-content">
            <div className="heading">
              <h2>Swap</h2>
            </div>

            <div className="swap-dashboard">
              <div className="swap-item active">
                <div className="title">
                  <h3>You pay</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input type="number" placeholder='0'
                      value={payInputValue} // force the input's value to match the state variable
                      onChange={e => setPayInputValue(e.target.value)} // and update the state variable on any edits
                    />
                  </div>
                  <button type="button" className="currency-label" onClick={() => setIsTokenSelectorOpen('pay')} >
                    {selectedToken(payToken)}
                  </button>
                </div>

                <div className="amount item-flex">
                  <div className="lt">
                  </div>
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: {isLoading ? 'loading...' : balance?.[payToken]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="mark" onClick={() => swapPayAndReceive()}>
                <i className="blind">swap</i>
              </button>

              <div className="swap-item">
                <div className="title">
                  <h3>You receive</h3>
                </div>

                <div className="amount-input">
                  <div className="input">
                    <input placeholder='0' readOnly
                      value={receiveToken && payInputValue ? (
                        calculationFormula()
                      ) : '0'} />
                  </div>
                  <button type="button" className={`currency-label ${!receiveToken && 'select'}`} onClick={() => setIsTokenSelectorOpen('receive')}>
                    {selectedToken(receiveToken)}
                  </button>
                </div>

                <div className="item-flex amount">
                  <div className="rt">
                    <div className="balance">
                      <span>Balance: {receiveToken ? balance?.[receiveToken] : '0'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-wrap">
                <button type="button" className="normal"
                  // disabling button if there's no selected token or input amount exceeds the user's balance
                  disabled={
                    (receiveToken !== payToken) ?
                      (receiveToken && payInputValue) ?
                        ((Number(payInputValue) <= balance?.[payToken]) ? false : true) : true : true
                  }
                  onClick={() => {
                    console.log(`swapped ${payInputValue} ${payToken} for ${calculationFormula()} ${receiveToken}`);
                    fetchData({
                      payToken: payToken,
                      payAmount: payInputValue,
                      receiveToken: receiveToken,
                      receiveAmount: calculationFormula(),
                    })
                  }}>
                  Swap
                </button>
                {isPending && <LoadingDot />}
                {response &&
                  (<div>{JSON.stringify(response.message)}</div>)
                }
              </div>

            </div>
          </div>
        </section>
      </div>
      {error && <div>{error}</div>}
      {isTokenSelectorOpen === 'receive' ? (
        <TokenSelector onClose={() => setIsTokenSelectorOpen('')} setToken={setReceiveToken} />
      ) :
        (isTokenSelectorOpen === 'pay' ? (
          <TokenSelector onClose={() => setIsTokenSelectorOpen('')} setToken={setPayToken} />
        ) :
          null
        )
      }
    </>
  );
}

export { Main as default };
