import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import moment from "moment";
import BuildAbi from '../../contracts/EscrowDapp.json';
import { Card, Typography, Button, TextField, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RoadCons from "../../assets/images/road-cons.jpg";

const useStyles = makeStyles((theme) => ({
  bg_image: {
    backgroundImage: `url(${RoadCons})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    // backgroundPosition: "center",
    height: "100vh",
  },
  title: {
    textAlign: "center",
    fontFamily: "monospace",
    margin: "0px",
    padding: "16px",
  },
  cards_div: {
    display: "flex",
    flexWrap: "wrap",
  },
  card: {
    margin: "20px",
    width: "28%",
    padding: "16px",
  },
  prjtname: {
    fontSize: "2rem !important ",
    fontFamily: "monospace",
  },
  btn: {
    fontFamily: "monospace",
    textTransform: "capitalize",
    float: "right",
    color: "#fff",
    backgroundColor: "#2c97dd",
    "&:hover": {
      backgroundColor: "#2c97dd",
    },
  },
  btn_prgs: {
    fontFamily: "monospace",
    textTransform: "capitalize",
    float: "right",
    color: "#fff",
    backgroundColor: "#17bb51",
    "&:hover": {
      backgroundColor: "#17bb51",
    },
  },
  form: {
    width: "50%",
    marginTop: theme.spacing(1),
    margin: 'auto',
    background: 'white',
    padding: 44
  },
}));

export default function ProjectList(props) {
  const classes = useStyles();

  const [contract, setContract] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isGovt, setIsGovt] = useState(true);
  const [isCustomer, setIsCustomer] = useState(true);
  const [formState, setFormState] = useState({});
  const [refetch, setRefetch] = useState(1);

  useEffect(() => {
    setIsGovt(localStorage.getItem('escrow-login-type') === 'Govt');
    setIsCustomer(localStorage.getItem('escrow-login-type') === 'Customers');
    if (account && contract) {
      console.log('account:', account);
      console.log('contract:', contract);
      console.log('contract address:', contract._address);
      setProjects([]);
      (async () => {
        try {
          const contractBalance = await contract.methods.contractBalance().call();
          console.log('contractBalance:', contractBalance);
          setContractBalance(Web3.utils.fromWei(contractBalance, 'ether'));
          const totalProjects = await contract.methods.totalProjects().call();
          console.log('totalProjects:', totalProjects);
          // load Projects
          for (var i = 1; i <= totalProjects; i++) {
            const project = await contract.methods.projects(i - 1).call();
            setProjects(projects => [...projects, project]);
          }
        } catch (error) {
          alert(error);
        }
      })();
    }
  }, [account, contract, refetch]);

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

  const handleDateChange = (e, type) => {
    setFormState(formState => ({
      ...formState,
      [type]: e.target.value
    }));
  };

  const handleRating = (index) => {
    localStorage.setItem('escrow-rating-index', index);
    props.history.push(`/feedback/${index}`);
  };

  const handleStart = async (index) => {
    let eth = 0;
    if (moment.unix(projects[index].project_start_timestamp).diff(moment()) < 0)
      eth = 1;
    let wei = Web3.utils.toWei(eth.toString(), 'ether');
    contract.methods.startProject(index, wei)
      .send({ from: account, value: wei })
      .on('error', (error, receipt) => {
        console.log(error, 'error');
        console.log(receipt, 'receipt');
        alert(JSON.stringify(error));
      })
      .on('receipt', async (receipt) => {
        console.log('success receipt:', receipt);
        setRefetch(refetch => refetch + 1);
      });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    contract.methods.createProject(formState.name, moment(formState.start).unix(), moment(formState.end).unix())
      .send({ from: account })
      .on('error', (error, receipt) => {
        console.log(error, 'error');
        console.log(receipt, 'receipt');
        alert(JSON.stringify(error));
      })
      .on('receipt', async (receipt) => {
        console.log('success receipt:', receipt);
        setRefetch(refetch => refetch + 1);
      });
  };

  return (
    <div className={classes.bg_image}>
      <h1 className={classes.title}>All Projects</h1>
      <div className={classes.cards_div}>
        {projects.map((project, index) => (
          <Card className={classes.card} key={index}>
            <Typography className={classes.prjtname}>{project.name}</Typography>
            <Typography>Start time: {moment.unix(project.project_start_timestamp).format('lll')}</Typography>
            <Typography>End time: {moment.unix(project.project_end_timestamp).format('lll')}</Typography>
            <Typography>Project Owner: {project.project_owner}</Typography>
            {isCustomer
              ?
              project.project_started
                ?
                <Button className={classes.btn} onClick={() => handleRating(index)}>Give Rating</Button>
                :
                <Button className={classes.btn}>Project not started</Button>
              :
              project.project_started
                ?
                <Button className={classes.btn_prgs}>In Progress</Button>
                :
                <Button className={classes.btn} onClick={() => handleStart(index)}>Start</Button>
            }
          </Card>
        ))}
      </div>

      {isGovt && (
        <form className={classes.form} onSubmit={handleSubmit}>
          <h1 className={classes.title}>Create Projects</h1>
          <h4 className={classes.title}>Contract balance: {contractBalance} ETH</h4>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Project Name"
            name="name"
            value={formState.name || ''}
            onChange={handleChange}
          />
          <br /><br />
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <TextField
              label="Project start time"
              type="datetime-local"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              value={formState.start || moment().format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => handleDateChange(e, 'start')}
            />
            <TextField
              label="Project end time"
              type="datetime-local"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              value={formState.end || moment().format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => handleDateChange(e, 'end')}
            />
          </Grid>
          <br /><br />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
