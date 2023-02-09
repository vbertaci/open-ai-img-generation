import React, { useState, useEffect } from "react";

import { Loader, Card, FormField } from "../components";

const RenderCards = ({ data, title }) => {
  console.log(data);
  if (data && data.length > 0) {
    console.log("batata");

    return data.map((post) => <Card key={post._id} {...post} />);
  } else
    return (
      <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
        {title}
      </h2>
    );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter(
          (post) =>
            post.name.toLowerCase().includes(search.toLowerCase()) ||
            post.prompt.toLowerCase().includes(search.toLowerCase())
        );
        setSearchResults(searchResults);
      }, 500)
    );
  };

  return (
    <section className="max-w7x1 mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px] mb-[32px]">
          Batata
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          As batatas somos nozes e nozes somos as potatos.
        </p>
      </div>

      <div className="mt-16">
        <FormField
          LabelName="Search posts"
          type="text"
          name="text"
          placeholder="Search posts"
          value={search}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {search && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Search Results for{" "}
                <span className="text-[#2222328]">"{search}"</span>
              </h2>
            )}
          </>
        )}
        <div
          className="grid
          lg:grid-cols-4
          sm:grid-cols-3
          xs:grid-cols-2
          grid-cols-1
          gap-3"
        >
          {search ? (
            <RenderCards data={searchResults} title="No search results found" />
          ) : (
            <RenderCards data={allPosts} title="No posts found" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
