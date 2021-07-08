import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Web3 from "web3";
import {Colors} from "../Themes/styles";

import NeverLogo from "../assests/NerveLogo.jpeg";
import BUSDLogo from "../assests/busd.png";
import {ChevronDown} from "@styled-icons/boxicons-regular/ChevronDown"
import {CaretUp} from "@styled-icons/boxicons-regular/CaretUp";
import { Construct } from "@styled-icons/ionicons-outline";

const ONE_ETHER = 1000000000000000000;

const TokenAddress = "0x3b1F033dD955f3BE8649Cc9825A2e3E194765a3F";
const TestWalletAddress = "0x962e62864c32E9C3C22eaC58932101d31101FF49";

var ERC_20_ABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];

const Container = styled.div`
    height: 914px;
    width: 500px; 
    background-color: ${Colors.background};
    color: ${Colors.fontColor};

    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 50px;
`
const PoolSelection = styled.div`
    background-color: ${Colors.lightBackground};
    color: ${Colors.lightFontColor};
    border-radius: 5px;

    padding: 10px;

    p {
        margin-left: 50px;
        margin-top: -25px;
    }
`

const RateDisplay = styled.div`
    color: ${Colors.fontColor};
    margin-bottom: 30px;

    ul{
        text-align: center;
        list-style-type: none;
    }

    li {
        background-color: ${Colors.lightBackground};
        float: left;
        margin-left: 20px;
        padding: 15px;
        border-radius: 5px;
        height: 50px;
    }

    p {
        color: green;
    }
`

const PosistionSize = styled.div`
    margin-top: 30px;
    border-radius: 10px;
    border: 0.5px solid grey;
`

const CollateralSize = styled.div`
    margin-top: 15px;
    border-radius: 10px;
    border: 1px solid grey;
`

const OpenLongPosition = styled.div`
    color: ${Colors.fontColor};
    background-color: ${Colors.lightBackground};

    border-radius: 20px;
    padding: 25px;
    margin: 25px;

    text-align: center;
`

const InputBox = styled.input`
    background-color: ${Colors.background};
    color: ${Colors.lightFontColor};
`

const InputRange = styled.input`
    width: 470px;
    backround-color: ${Colors.background};
`

const BottomMeta = styled.div`
    color: ${Colors.fontColor};

    ul{
        text-align: center;
        list-style-type: none;
    }

    li {
        float: left;
        margin-left: 50px;
        padding: 15px;
        border-radius: 5px;
        height: 50px;
    }
`

export default function Exchange () {

    const [leverage, setLeverage] = useState(1);
    const [posistionSize, setPosistionSize] = useState(1.00);
    const [collateral, setCollateral] = useState(1.00);
    const [accountBalance, setAccountBalance] = useState(0);

    const [error, setError] = useState(null);

    async function updatePosistionSize(value) {
        var newValue = parseFloat(value);
        console.log("New Value: " + newValue);
        if (newValue < 0) {
            setError("Inputs Can Not Be Negativ")
            return false;
        } else if (newValue > accountBalance) {
            setError("Input Can Not Be Below Account Balance")
            return false;
        } else {
            setPosistionSize(newValue);
            setCollateral(newValue * leverage);
        }
    }

    function updateCollateral (value) {
        var newValue = parseFloat(value);
   
        if (newValue < 0) {
            setError("Inputs Can Not Be Negativ")
            return false;
        } else if (newValue > accountBalance) {
            setError("Input Can Not Be Below Account Balance")
            return false;
        } else {
            setCollateral(newValue);
            setPosistionSize(newValue * leverage);
        }
    }

    function updateLeverage (value) {
        var newValue = parseFloat(value);

        setLeverage(newValue);
        setCollateral(collateral * newValue);
        setPosistionSize(posistionSize * newValue);
    }

    async function get_token_balance() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();

        const Contract = new web3.eth.Contract(
            ERC_20_ABI,
            TokenAddress
        )
        
        await Contract.methods.balanceOf(TestWalletAddress).call(function(error, result){
            console.log("BUSD Balance: " + (result / ONE_ETHER));
            setAccountBalance(result / ONE_ETHER)
        });             
    }


    useEffect(async () => {

        async function loadWeb3() {
            if (window.ethereum) {
              window.web3 = new Web3(window.ethereum);
              await window.ethereum.enable();
              return true;
            } else if (window.web3) {
              window.web3 = new Web3(window.web3.currentProvider);
              return true;
            } else {
              return false;
            }
          }

        await loadWeb3();
        await get_token_balance();
    })

    return (
        <>
            <Container>
                <h2 Style="color: white">Exchange</h2>
                <h3>Trade swaps in an instant</h3>

                <PoolSelection>
                    <img src={NeverLogo} height="30" width="30" alt="" />
                    <p> Nerve > 3pool </p> 
                    <div Style="float: left; margin-left: 90%; margin-top: -35px;">
                        <ChevronDown size="20" />
                    </div>
                </PoolSelection>

                <RateDisplay>
                    <ul>
                        <li>Oracle (floating) rate  <p> <CaretUp size="20" /> 13.52% </p> </li>
                        <li>Market (fixed) rate <p> <CaretUp size="20" /> 91.26% </p></li>   
                    </ul>          
                </RateDisplay>
                <br />
                <br />
                <br />

                <PosistionSize>
                    <p>Position Size</p>

                    <InputBox
                            type="text"
                            placeholder={posistionSize}
                            onChange={e => updatePosistionSize(e.target.value)} 
                            />

                    <img src={BUSDLogo} height="30" width="30" alt="" />
                    <p1>BUSD</p1>
                </PosistionSize>

                <div Style="margin-top: 20px;">
    
                   <InputRange type="range"
                            min={0} max={10}
                            value={leverage}
                            step={1}
                            onChange={e => updateLeverage(e.target.value)} />
                    {leverage}x
                </div>

                <CollateralSize>
                    <p Style="padding-left: 8px;">Collateral</p>
                    <p Style="text-align: right;
                             margin-top: -40px;
                             padding-right: 8px;"> Balance {accountBalance} BUSD</p>

                    <InputBox
                            type="number"
                            placeholder={collateral}
                            onChange={e => updateCollateral(e.target.value)} 
                            />
                    <p>MAX</p>
                    <img src={BUSDLogo} height="30" widht="30" alt="" />
                    <p1>BUSD</p1>
                </CollateralSize>

                <BottomMeta>
                    <ul>
                        <li>Pay Fixed <p>91.62% </p></li>
                        <li>Receive Floating <p>13.62% </p></li>
                    </ul>
                </BottomMeta>
                <br /> <br /> <br />

                <OpenLongPosition>
                        OPEN LONG POSISTION
                </OpenLongPosition>

                <p Style="text-align: center;">Slippage Tolerance: 3.00%</p>
                <h1>Error Section: </h1>

                <h3> {error} </h3>
            </Container>
        </>
    )
}