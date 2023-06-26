// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  renderLoadingView = () => (
    <div className="primedeals-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      const updating = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }

      const {similarProducts} = updating
      const updatingSimilarProducts = similarProducts.map(eachProduct => ({
        id: eachProduct.id,
        imageUrl: eachProduct.image_url,
        title: eachProduct.title,
        price: eachProduct.price,
        description: eachProduct.description,
        brand: eachProduct.brand,
        totalReviews: eachProduct.total_reviews,
        rating: eachProduct.rating,
        availability: eachProduct.availability,
      }))

      updating.similarProducts = updatingSimilarProducts

      this.setState({
        productDetails: updating,
        similarProducts: updatingSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickPlus = () => {
    const {count} = this.state
    this.setState({count: count + 1})
  }

  onClickMinus = () => {
    const {count} = this.state
    if (count === 1) {
      this.setState({count})
    } else {
      this.setState({count: count - 1})
    }
  }

  renderProduct = () => {
    const {productDetails, count} = this.state
    console.log(productDetails)
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    console.log('charan')
    return (
      <>
        <div className="product-bg-container">
          <div className="product-image-container">
            <img src={imageUrl} alt="product" className="product-image" />
          </div>
          <div className="about-product">
            <h1>{title}</h1>
            <p>RS {price}/-</p>
            <div className="rating-review">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p>
              <span>Available: </span> {availability}
            </p>
            <p>
              <span>Brand: </span> {brand}
            </p>
            <hr />
            <div className="product-count">
              <button
                type="button"
                onClick={this.onClickMinus}
                data-testid="minus"
                className="icon-btn"
              >
                <BsDashSquare className="icon-plus" />
              </button>
              <p className="count-opera"> {count}</p>
              <button
                data-testid="plus"
                onClick={this.onClickPlus}
                type="button"
                className="icon-btn"
              >
                <BsPlusSquare className="icon-plus" />
              </button>
            </div>

            <button type="button" className="btn-name">
              {' '}
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    console.log(similarProducts)
    return (
      <div className="similar-product-bg-container">
        <h1 className="similar-head">Similar Products</h1>
        <div className="similar-products-container">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              key={eachProduct.id}
              productData={eachProduct}
            />
          ))}
        </div>
      </div>
    )
  }

  renderFailureView = () => {
    console.log('Failure')
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
          className="error-img"
        />
        <h1>Product Not Found</h1>
        <Link to="/products">
          <button type="button" className="btn-name">
            Continue Shopping
          </button>
        </Link>
      </div>
    )
  }

  renderBasedCondition = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProduct()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderBasedCondition()}
      </>
    )
  }
}

export default ProductItemDetails
