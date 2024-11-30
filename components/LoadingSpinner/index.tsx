// LoadingSpinner.js
import React from "react"
import { Spinner } from "flowbite-react"

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-wrap items-center gap-2 h-100 w-auto">
        <Spinner
          aria-label="Extra large spinner example"
          size="xl"
          color="warning"
          light={true}
        />
      </div>
    </div>
  )
}

export default LoadingSpinner
