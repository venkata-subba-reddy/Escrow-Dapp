import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import BuildAbi from '../../contracts/EscrowDapp.json';
import { makeStyles } from "@material-ui/core/styles";
import { Typography, TextareaAutosize } from "@material-ui/core";
import StarRatingComponent from "react-star-rating-component";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
  },
  stars: {
    display: "flex !important",
    justifyContent: "center",
    direction: "rtl",
    fontSize: "40px",
    marginTop: "10%",
  },
  textarea: {
    width: "60%",
    margin: "5% 20% 5% 20%",
    padding: "16px",
  },
}));

export default function Feedback(props) {

  const classes = useStyles();

  const [rating, setRating] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [project, setProject] = useState([]);
  const [formState, setFormState] = useState({});

  const projectIndex = props.match.params.index;

  useEffect(() => {
    if (account && contract) {
      console.log('account:', account);
      console.log('contract:', contract);
      console.log('contract address:', contract._address);
      (async () => {
        const project = await contract.methods.projects(projectIndex).call();
        setProject(project);
        const rating = await contract.methods.getRating(projectIndex, account).call();
        console.log('rating:', rating);
        setFormState({ review: rating['0'] });
        setRating(parseInt(rating['1']));
      })();
    }
  }, [account, contract, projectIndex]);

  useEffect(() => {
    (async () => {
      console.log('Connecting to Ethereum via MetaMask!');
      await loadWeb3();
      await loadBlockchainData();
      if (!window.ethereum) return;
      // handle account change
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('accountsChanged', accounts);
        setAccount(accounts[0]);
      });
      // handle network change
      window.ethereum.on('networkChanged', (networkId) => {
        console.log('networkChanged', networkId);
        const networkData = BuildAbi.networks[networkId];
        if (networkData) {
          const abi = BuildAbi.abi;
          const address = networkData.address;
          const contract = new window.web3.eth.Contract(abi, address);
          setContract(contract);
        } else {
          alert('Smart contract not deployed to detected network.');
        }
      });
    })();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    if (!web3) return;
    // Load account
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const networkData = BuildAbi.networks[networkId];
    if (networkData) {
      const abi = BuildAbi.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
    } else {
      alert('Smart contract not deployed to detected network.');
    }
  };

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  };

  const onStarClick = (nextValue, prevValue, name) => {
    contract.methods.rateProject(projectIndex, nextValue, formState.review || '')
      .send({ from: account })
      .on('error', (error, receipt) => {
        console.log(error, 'error');
        console.log(receipt, 'receipt');
        alert(JSON.stringify(error));
      })
      .on('receipt', async (receipt) => {
        console.log('success receipt:', receipt);
        alert('Rated Successfully!')
        setTimeout(() => {
          props.history.push('/project-list');
        }, 1000);
      });
  }

  return (
    <div>
      <h1 className={classes.title}>Customer Reviews</h1>
      <Typography className={classes.title}>
        {project.name}
      </Typography>
      <Typography className={classes.title}>
        Customer Reviews means alot to us
      </Typography>
      <TextareaAutosize
        aria-label="minimum height"
        rowsMin={6}
        placeholder="Write your review.."
        className={classes.textarea}
        name="review"
        value={formState.review || ''}
        onChange={handleChange}
      />
      <StarRatingComponent
        name="rate1"
        starCount={10}
        value={rating}
        onStarClick={onStarClick}
        className={classes.stars}
      />
      <br />
      {rating && (
        <Typography className={classes.title}>Thank you!</Typography>
      )}
    </div>
  );
}