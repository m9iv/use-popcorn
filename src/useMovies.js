import { useState, useEffect } from 'react'

// Set your key here. Read how on official page of OMDB API: https://www.omdbapi.com
const OMDB_KEY = '9d61f073'

export function useMovies(query) {
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchMovies = async () => {
      try {
        setIsLoading(true)
        setError('')

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}&page=1`,
          { signal: controller.signal }
        )

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies')

        const data = await res.json()
        if (data.Response === 'False') throw new Error('👀 Movie not found')

        if (data.Search) {
          setMovies(data.Search.splice(0, 5))
          setIsLoading(false)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.length < 3) {
      setMovies([])
      setError('')
      return
    }

    fetchMovies()

    return function () {
      controller.abort()
    }
  }, [query])

  return { movies, isLoading, error }
}
