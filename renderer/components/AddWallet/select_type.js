import {useState} from "react"

const TypeOptions = {
    Standard: "standard",
    Import: "import",
}

const SelectType = ({onSelectStandard, onSelectImport, onBack}) => {
    const [isStandard, setIsStandard] = useState(true)

    const changeWalletType = (e) => {
        setIsStandard(e.target.value === TypeOptions.Standard)
    }

    const handleClickNext = () => {
        if (isStandard) {
            onSelectStandard()
        } else {
            onSelectImport()
        }
    }

    return (
        <div>
            <h2>Create Wallet</h2>
            <p>What kind of wallet do you want to create?</p>
            <div>
                <p><label>
                    <input type="radio" name="type" value={TypeOptions.Standard} onChange={changeWalletType}/>
                    Standard wallet
                </label></p>
                <p><label>
                    <input type="radio" name="type" value={TypeOptions.Import} onChange={changeWalletType}/>
                    Import Bitcoin private keys
                </label></p>
            </div>
            <div>
                <p>
                    <button onClick={handleClickNext}>Next</button>
                </p>
                <p>
                    <button onClick={onBack}>Back</button>
                </p>
            </div>
        </div>
    )
}

export default SelectType
