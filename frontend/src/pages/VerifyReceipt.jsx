import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function VerifyReceipt() {

    const { receiptNumber } = useParams();

    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        verifyReceipt();

    }, []);

    async function verifyReceipt() {

        try {

            const response = await api.get(
                `/receipts/verify/${receiptNumber}`
            );

            setResult(response.data);

        }

        catch (error) {

            console.error(error);

            setResult({

                valid: false,

                message: "Unable to verify receipt."

            });

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="flex justify-center items-center h-screen text-xl">

                Verifying receipt...

            </div>

        );

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-6">

                    Receipt Verification

                </h1>

                {

                    result.valid ? (

                        <>

                            <div className="text-green-600 text-center text-6xl mb-4">

                                ✓

                            </div>

                            <h2 className="text-green-700 text-2xl font-bold text-center">

                                VALID RECEIPT

                            </h2>

                            <p className="text-center mt-3">

                                {result.message}

                            </p>

                            <hr className="my-5" />

                            <p>

                                <strong>Receipt:</strong>{" "}

                                {result.receipt.receiptNumber}

                            </p>

                            <p>

                                <strong>Customer:</strong>{" "}

                                {result.receipt.customerName}

                            </p>

                            <p>

                                <strong>Total:</strong>{" "}

                                KSh {result.receipt.total.toFixed(2)}

                            </p>

                            <p>

                                <strong>Payment:</strong>{" "}

                                {result.receipt.paymentStatus}

                            </p>

                        </>

                    ) : (

                        <>

                            <div className="text-red-600 text-center text-6xl mb-4">

                                ✗

                            </div>

                            <h2 className="text-red-700 text-2xl font-bold text-center">

                                INVALID RECEIPT

                            </h2>

                            <p className="text-center mt-3">

                                {result.message}

                            </p>

                        </>

                    )

                }

            </div>

        </div>

    );

}