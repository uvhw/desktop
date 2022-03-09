import {useRef, useState} from "react"
import Modal from "./index"

const DisplaySeedModal = ({
    isOpen,
    onClose
}) => {
    const [hasEnteredWrongPassword, setHasEnteredWrongPassword] = useState(false)
    const [showSeed, setShowSeed] = useState(false)
    const [seedPhrase, setSeedPhrase] = useState("")
    const passwordInputRef = useRef()

    const handleCheckPassword = async () => {
        const enteredPassword = passwordInputRef.current.value
        const storedPassword = await electron.getPassword()
        if(enteredPassword === storedPassword) {
            const { seed } = await electron.getWallet()
            setSeedPhrase(seed)
            setShowSeed(true)
        } else {
            setHasEnteredWrongPassword(true)
        }
    }

    const handlePasswordChange = () => {
        if(hasEnteredWrongPassword) {
            setHasEnteredWrongPassword(false)
        }
    }

    const handlePasswordKeyDown = (e) => {
        if(e.keyCode === 13) {
            handleCheckPassword()
        }
    }

    const handleClose = () => {
        setSeedPhrase("")
        setShowSeed(false)
        setHasEnteredWrongPassword(false)
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
        >
            {!showSeed &&
                <div>
                    <p>Enter your password</p>
                    <p>
                        <label>Password:
                            <input autoFocus ref={passwordInputRef} onChange={handlePasswordChange}
                               onKeyDown={handlePasswordKeyDown} type="password"/>
                        </label>
                    </p>
                    {hasEnteredWrongPassword &&
                        <p>Incorrect password</p>
                    }
                    <p>
                        <button onClick={handleClose}>Cancel</button>
                        <button onClick={handleCheckPassword}>OK</button>
                    </p>
                </div>
            }
            {showSeed &&
                <div>
                    <p>Your wallet seed phrase is:</p>
                    <textarea value={seedPhrase} readOnly />
                    <p>
                        <button onClick={handleClose}>Close</button>
                    </p>
                </div>
            }
        </Modal>
    )
}

export default DisplaySeedModal