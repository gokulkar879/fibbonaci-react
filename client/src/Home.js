import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Home() {

    const [index, setIndex] = useState('');
    const [values, setValues] = useState({});
    const [calculatedIndexes, setCalculatedIndex] = useState([]);

    const fetchValues = async () => {
        const values = await axios.get('/api/values/current');
        console.log(values, "1");
        setValues(values.data);
    }

    const fetchIndexes = async () => {
        const calculatedIndexes = await axios.get('/api/values/all');
        console.log(calculatedIndexes, "2");
        setCalculatedIndex(calculatedIndexes.data);
    }

    const handleSubmit = async ev => {
        ev.preventDefault();

        await axios.post('/api/values', {
            index: index
        })

        setIndex('');
    }

    const renderValues = () => {
        const entries = [];
        for(const key in values) {
            entries.push(<div key={key}>
                for index {key} the values is {values[key]}
            </div>)
        }
        return entries;
    }

    const renderCalculatedIndexes = () => {
        return calculatedIndexes.map(({number}) => number).join(', ');
    }

    useEffect(() => {
        fetchIndexes();
        fetchValues();
    }, [])

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>Enter your index
                <input value={index} onChange={ev => setIndex(ev.target.value)}></input>
                <button type="submit">Submit</button>
            </label>

            <h4>Indexes already answered:</h4>
            {
                renderCalculatedIndexes()
            }

            <h4>Calculated values</h4>
            {
                renderValues()
            }
        </form>
    </div>
  )
}

export default Home