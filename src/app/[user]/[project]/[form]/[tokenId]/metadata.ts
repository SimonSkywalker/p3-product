// metadata.ts
import { Metadata } from 'next';

// Define an interface for the params object
interface MetadataParams {
    params: {
        user: string;
        project: string;
        form: string;
        tokenId: string;
    }
  }

export async function generateMetadata({ params } : MetadataParams) : Promise<Metadata> {
  return {
    title: `${params.form} | Project management survey tool (working title)`,
  };
}