import React, { Component } from 'react';
import './App.css';
import { List } from 'react-virtualized';
import { Loader } from '../components'
import  axios  from 'axios'
import { Form, Text } from 'react-form'

class App extends Component {
  state = {
    listOfClients: [],
    isFetching: true,
    buttonAdd: true,
    gender: {
      male: true,
      female: true
    },
    uniqueUser: null
  }
  startPoint = null
  defaultList = []

  componentDidMount() {
      axios.get('http://api.demo.lakmus.org/api/clients')
        .then(({data}) => {
          this.setState({listOfClients: data, isFetching: false}, () => {
            this.startPoint = 50
            this.defaultList = this.state.listOfClients
          })
        })
        .catch(err => console.error(err))
  }

  rowRenderer = ({index, key, style}) => (
    <div className='table'
         key={key}
         style={style}>
      <div className='table_row client_name'>{this.state.listOfClients[index].name || 'no-name'}</div>
      <div className='table_row client_phone'>{this.state.listOfClients[index].contactPerson || 'no-phone'}</div>
      <div className='table_row client_email'>{this.state.listOfClients[index].email || 'no-email'}</div>
      <div className='table_row client_dateOfBirth'>{this.state.listOfClients[index].birthYear || 'no-birth'}</div>
      <div className='table_row client_adrress'>{this.state.listOfClients[index].address || 'no-address'}</div>
    </div>
  )
  getMoreClients = () => {
    this.setState({buttonAdd: false})
    axios.get(`http://api.demo.lakmus.org/api/clients?_start=${this.startPoint}`)
    .then(({data}) => {
      const newList = JSON.parse(JSON.stringify(this.state.listOfClients)).concat(data)

      this.setState({listOfClients: newList, isFetching: false, buttonAdd: true}, () => {
        this.startPoint = this.state.listOfClients.length
        this.defaultList = this.state.listOfClients
      })
    })
    .catch(err => console.error(err))
  }
  handleSearchByName = (e) => {
    const {value} = e.target
    const newList = []
      this.defaultList.forEach(elem => {
        if (elem.name.indexOf(value) >= 0 ) {
          newList.push(elem)
        }
      })

    this.setState({listOfClients: newList})
  }

  handleGenderChange = (gender) => {

    this.setState({gender: {...this.state.gender, [gender]: !this.state.gender[gender]}}, () => {
      const newList = []

      this.defaultList.forEach(elem => {
        if (this.state.gender[elem.gender]) {
          newList.push(elem)
        }
      })

      this.setState({listOfClients: newList})
    })
  }

  handleForm = (values) => {
    axios.post('http://api.demo.lakmus.org/api/clients', values)
      .then(({data}) => {
        const newList = JSON.parse(JSON.stringify(this.state.listOfClients)).concat([data])
        this.setState({listOfClients: newList}, () => {
          this.defaultList = this.state.listOfClients
        })
      })
      .catch(err => console.error(err))
  }

  findUser = () => {
    const id = this.refs.idForUser.value

    axios.get(`http://api.demo.lakmus.org/api/clients/${id}`)
      .then(({data}) => {
        this.setState({uniqueUser: data})
      })
      .catch(err => console.error(err))
  }

  render() {
    if (this.state.isFetching) {
      return <Loader/>
    }
    return (
      <div className="App">
        <List
          width={window.innerWidth}
          height={300}
          rowCount={this.state.listOfClients.length}
          rowHeight={25}
          rowRenderer={this.rowRenderer}
        />
        <div className='options'>
          <div className='options-title'>Settings</div>
          <div className='options-pagination'>
            <div className='options-pagination_title'>Pagination</div>
            <button className='options-pagination_button' onClick={this.getMoreClients} disabled={!this.state.buttonAdd}>
              Add more 50 clients
            </button>
          </div>
          <div className='options-filter'>
            <div className='options-filter_title'>Filter by name</div>
            <input className='options-filter_input' onChange={this.handleSearchByName}/>
          </div>
          <div className='options-filter'>
            <div className='options-filter_title'>Filter by gender</div>
            <label className='options-filter_label' htmlFor="male">
                <input
                  className='options-filter_checkbox'
                  name='male'
                  type='checkbox'
                  value='male'
                  checked={this.state.gender.male}
                  onChange={this.handleGenderChange.bind(null, 'male')}
                />
              <span>male</span>
            </label>
            <label htmlFor="female">
                <input
                  className='options-filter_checkbox'
                  name='female'
                  type='checkbox'
                  checked={this.state.gender.female}
                  onChange={this.handleGenderChange.bind(null, 'female')}
                />
              <span>female</span>
            </label>
            </div>
        </div>

        <div className='options-title'>Form to add</div>
        <Form onSubmit={this.handleForm}>
        {formApi => (
          <form onSubmit={formApi.submitForm} className='form' id="form">
            <label htmlFor="name">
              Name
              <Text field="name" id="name" />
            </label>

            <label htmlFor="gender">
              Gender
              <Text field="gender" id="gender" />
            </label>

            <label htmlFor="birthYear">
              BirthYear
              <Text field="birthYear" id="birthYear" />
            </label>

            <label htmlFor="birthMonth">
              BirthMonth
              <Text field="birthMonth" id="birthMonth" />
            </label>

            <label htmlFor="birthDay">
              BirthDay
              <Text field="birthDay" id="birthDay" />
            </label>

            <label htmlFor="phone">
              Phone
              <Text field="phone" id="phone" />
            </label>

            <label htmlFor="email">
              Email
              <Text field="email" id="email" />
            </label>

            <label htmlFor="address">
              Address
              <Text field="address" id="address" />
            </label>

            <label htmlFor="description">
              Description
              <Text field="description" id="description" />
            </label>

            <button type="submit">Add new user</button>
          </form>
        )}
        </Form>

        <div className='options-title'>Find unique user</div>
        <div className='get-user'>
          <input type="text" className='get-user_input' ref='idForUser' />
          <button className='get-user_button' onClick={this.findUser}>
            Find info on user by id
          </button>
          { this.state.uniqueUser && (
            <div>
              <h4>Result</h4>
              {Object.keys(this.state.uniqueUser).map((key) => (
              <div className='unique-user' key={key}>
                <div className='unique-user_title'>{key}</div>
                <div className='unique-user_value'>{this.state.uniqueUser[key] || 'no such data'}</div>
              </div>
            ))}
            </div>)
          }
        </div>
      </div>
    );
  }
}

export default App;
