"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  CreditCard,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Github,
  RefreshCw,
} from "lucide-react";

type UPIData = {
  [key: string]: string;
};

const MotionCard = motion(Card);
const MotionButton = motion(Button);

export default function Home() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [upiIDs, setUpiIDs] = useState<UPIData>({});
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("credupiData");
    if (savedData) {
      const { mobileNumber, creditCard, upiIDs, selectedBank } =
        JSON.parse(savedData);
      setMobileNumber(mobileNumber);
      setCreditCard(creditCard);
      setUpiIDs(upiIDs);
      setSelectedBank(selectedBank);
    }
  }, []);

  const generateUPIIDs = () => {
    if (
      mobileNumber.length !== 10 ||
      (creditCard.length !== 16 && creditCard.length !== 15)
    ) {
      alert(
        "Please enter a valid 10-digit mobile number and 15 or 16-digit credit card number."
      );
      return;
    }

    const last4Digits = creditCard.slice(-4);
    const newUpiIDs: UPIData = {
      Axis: `CC.91${mobileNumber}${last4Digits}@axisbank`,
      ICICI: `ccpay.${creditCard}@icici`,
      "AU Bank": `AUCC${mobileNumber}${last4Digits}@AUBANK`,
      IDFC: `${creditCard}.cc@idfcbank`,
      AMEX:
        creditCard.length === 15
          ? `AEBC${creditCard}@SC`
          : "Not applicable for 16-digit cards",
      SBI: `Sbicard.${creditCard}@SBI`,
    };

    setUpiIDs(newUpiIDs);
    setSelectedBank(Object.keys(newUpiIDs)[0]);
    localStorage.setItem(
      "credupiData",
      JSON.stringify({
        mobileNumber,
        creditCard,
        upiIDs: newUpiIDs,
        selectedBank: Object.keys(newUpiIDs)[0],
      })
    );
  };

  const copyToClipboard = (bank: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const resetAll = () => {
    setMobileNumber("");
    setCreditCard("");
    setUpiIDs({});
    setSelectedBank(null);
    localStorage.removeItem("credupiData");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <MotionCard
          className="overflow-hidden backdrop-blur-xl bg-white/10 border-0 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <CardHeader className="pb-2 relative z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 filter blur-3xl transform -skew-y-6"></div>
            <CardTitle className="space-y-8 text-5xl font-extrabold text-white relative z-10">
              Creduπ
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <motion.div className="space-y-8" layout>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={mobileNumber}
                      onChange={(e) =>
                        setMobileNumber(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      className="pl-10 bg-white/5 text-white border-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      disabled={Object.keys(upiIDs).length > 0}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="creditcard"
                    className="block text-sm font-medium text-gray-200 mb-1"
                  >
                    Credit Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="creditcard"
                      type="text"
                      placeholder="Enter 15 or 16-digit number"
                      value={creditCard}
                      onChange={(e) =>
                        setCreditCard(
                          e.target.value.replace(/\D/g, "").slice(0, 16)
                        )
                      }
                      className="pl-10 bg-white/5 text-white border-gray-500 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      disabled={Object.keys(upiIDs).length > 0}
                    />
                  </div>
                </div>
              </div>
              {Object.keys(upiIDs).length === 0 && (
                <MotionButton
                  onClick={generateUPIIDs}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Generate UPI Details
                </MotionButton>
              )}
              {Object.keys(upiIDs).length > 0 && (
                <MotionButton
                  onClick={resetAll}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset and Start Again
                </MotionButton>
              )}
            </motion.div>

            <AnimatePresence>
              {Object.keys(upiIDs).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-gray-600 bg-white/5 p-2">
                    <motion.div className="flex w-max space-x-4 p-2" layout>
                      {Object.keys(upiIDs).map((bank) => (
                        <MotionButton
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          variant={
                            selectedBank === bank ? "secondary" : "ghost"
                          }
                          className={`flex-shrink-0 ${
                            selectedBank === bank
                              ? "bg-white/25 text-gray-200 font-extrabold"
                              : "bg-white/10 text-gray-300 font-bold"
                          } rounded-lg`}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {bank}
                        </MotionButton>
                      ))}
                    </motion.div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>

                  <AnimatePresence mode="wait">
                    {selectedBank && (
                      <MotionCard
                        key={selectedBank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-xl overflow-hidden"
                      >
                        <CardHeader>
                          <CardTitle className="text-xl text-white">
                            {selectedBank} UPI ID
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              value={upiIDs[selectedBank]}
                              readOnly
                              className="flex-grow bg-white/10 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <MotionButton
                              onClick={() =>
                                copyToClipboard(
                                  selectedBank,
                                  upiIDs[selectedBank]
                                )
                              }
                              size="sm"
                              variant="outline"
                              className="bg-white/10 hover:bg-white/20 text-white border-gray-600"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {copiedBank === selectedBank ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-white" />
                              )}
                            </MotionButton>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <MotionButton
                                  variant="outline"
                                  className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/50 border-gray-600"
                                  whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  QR Code
                                </MotionButton>
                              </DialogTrigger>
                              <DialogContent className="bg-gray-800/90 backdrop-blur-xl text-white border-gray-700 rounded-2xl shadow-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-semibold mb-4">
                                    {selectedBank} UPI QR Code
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col items-center space-y-6">
                                  <div className="bg-white p-4 rounded-xl shadow-inner">
                                    <QRCodeSVG
                                      value={`upi://pay?pa=${encodeURIComponent(
                                        upiIDs[selectedBank]
                                      )}&pn=${encodeURIComponent(
                                        selectedBank
                                      )}&cu=INR`}
                                      size={200}
                                    />
                                  </div>
                                  <p className="text-sm text-center break-all bg-white/10 p-3 rounded-lg">
                                    {upiIDs[selectedBank]}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <MotionButton
                              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white font-semibold rounded-xl"
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <a
                                href={`upi://pay?pa=${encodeURIComponent(
                                  upiIDs[selectedBank]
                                )}&pn=${encodeURIComponent(
                                  selectedBank
                                )}&cu=INR`}
                                className="flex items-center justify-center space-x-2"
                              >
                                <span>Pay Now</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </MotionButton>
                          </div>
                        </CardContent>
                      </MotionCard>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-gray-400"
            >
              <p>
                Note: Check before paying whether the ID is valid for payment.
              </p>
            </motion.div>
          </CardContent>
        </MotionCard>
      </motion.div>

      <footer className="mt-8 text-center text-gray-400 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div>
          Developed by{" "}
          <a
            href="https://www.linkedin.com/in/somritdasgupta"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Somrit
          </a>
        </div>
        <a
          href="https://github.com/somritdasgupta/cred-pi"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors duration-300"
        >
          <Github size={20} />
          <span>Open-Sourced on GitHub</span>
        </a>
        <div className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm">
          v1.0.0
        </div>
      </footer>
    </main>
  );
}
