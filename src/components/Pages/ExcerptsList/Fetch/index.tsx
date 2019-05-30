import { graphql } from 'gatsby';
import * as React from 'react';

import ExcerptsListTemplate from 'components/Pages/ExcerptsList/Template';
import { ExcerptsListQuery } from 'typings/graphql';
import { toPostExcerpt } from 'utils/mapper';

interface ExcerptsFetchProps {
  data: ExcerptsListQuery;
  pageContext: {
    currentPage: number;
    pagesSum: number;
  };
}

export default function ExcerptsFetch({
  data: {
    site: {
      siteMetadata: { siteInfo },
    },
    allMarkdownRemark,
    authorProfilePicture,
  },
  pageContext,
}: ExcerptsFetchProps) {
  return (
    <ExcerptsListTemplate
      siteInfo={siteInfo}
      posts={allMarkdownRemark.edges.map(toPostExcerpt)}
      authorProfilePictureSrc={authorProfilePicture.childImageSharp.resize.src}
      {...pageContext}
    />
  );
}

export const pageQuery = graphql`
  query ExcerptsList($skip: Int, $limit: Int) {
    site {
      siteMetadata {
        siteInfo {
          ...SiteInfoAll
        }
        authorInfo {
          ...AuthorInfoAll
        }
      }
    }
    authorProfilePicture: file(relativePath: { eq: "profile-picture.jpg" }) {
      childImageSharp {
        resize(width: 256, height: 256, quality: 100) {
          src
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___published], order: DESC }
      filter: { frontmatter: { draft: { eq: false } } }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          frontmatter {
            ...PostExcerpt
          }
        }
      }
    }
  }
`;