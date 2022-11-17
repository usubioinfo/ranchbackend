#!/usr/bin/perl -w
# use strict;
use Getopt::Long;

%opts = (min=>1,max=>6, t=> 5,ml=> 10, sp=>MicroSatMiner_results);

GetOptions(\%opts,"i=s", "min=s","max=s","t=s","sp=s", "ml=s");

if(!defined($opts{i}) || defined($opts{help})){
  &Usage();
  exit(0);
  }

my ($seq,$min_motif, $max_motif, $times, $out, $ml)=($opts{i},$opts{min},$opts{max},$opts{t}, $opts{sp}, $opts{ml});

print "\n\n";
system("date");
my $datestart = time;

print qq(
###############################################
   Welcome to use MicroSatMiner tool!
     
     Program id:   MicroSatMiner.pl
     Author:       Naveen Duhan
     email:        naveen.duhan[at]usu.edu 
     Date:         02/09/2020 
     Version:      1.0    
           
###############################################
);

print "\n Your parameters for prediction are :\n";
print "\n Your sequence file is: $seq\n";
print "\n Minimum number of repeats to look for: $min_motif\n";
print "\n Maximum number of repeats to look for: $max_motif\n";
print "\n Number of times a mono repeat motif should repeat: $ml\n";
print "\n Number of times a motif should repeat is: $times\n";
print "\n Thats all, you can sit back and relax. Your results will be available in some time.\n";


# Declare variables 

my $id=""; 
my $seq_len=0;
my $refseq=""; 
my $refseq_sub=""; 
my $pos=0; 
my $start=0; 
my $end=0; 
my $count=0; 
my $repeat_len=0; 
my $repeat=""; 
my @locus=""; 
my $len=0;
my $type="";
 

 
$times = $times-1;

open (IN, "<$seq")|| die("unable to open file");
open (OUT, ">$seq.tmp");
print OUT "ID\tCount\tStart\tEnd\tRepeat_number\t motif\t Sequecne_lenght\n";

while ( $refseq=<IN>){  # one line at at time
  chomp $refseq;
  
  # print ($refseq);
  #get seq ID and seq             
    if($refseq=~m/^>.+/){ 
           
            $id=$refseq;
            $pos=0;
            $refseq_sub="";
            $refseq="";
            $start=0;
            $end=0;
            $count=0;  
             
           foreach $repeat(@locus){
         (print OUT $repeat,$len,"\n" )if(length $repeat != 0);
           }
       @locus=""; #reset
       $len=0;
      
    }else{
     
      $refseq=~ s/[0-9\n\s]//g;    # remove newlines, numbers and white space        
      $len +=length $refseq;
      $refseq=$refseq_sub.$refseq;
      $count =$count+1;
      $seq_len=length $refseq;
      
    # look for repeat motif 

    while($refseq=~ /([ACGT]{$min_motif,$max_motif}?)\1{$times,}/gix){

      my $motif=uc $1;
      $repeat_len=length $motif;    
      my $redmotif=int($repeat_len/2)+1 ;
      $redmotif =1 if ($redmotif <=1);
      $start=$-[0]+1; #   start position in sequence
      $end= $+[0]; #  end position in sequence
      # print $start, "\t", $end," 1st matchposition\n";


      unless ($motif=~/^([ACGT]{1,$redmotif})\1+$/ix){

        my $t_rep=($end-$start+1)/$repeat_len;
        $start=$start+$pos;
        $end=$end+$pos;

          push (@locus,join("\t",$id,$count, $start,$end,$t_rep,$motif, $type));
        
  }
}
          my $reconsiderlen=20;
          $pos = $pos + $seq_len - $reconsiderlen + 1;
          $refseq_sub = substr($refseq, $seq_len - $reconsiderlen +1, $reconsiderlen -1);
         } # end  else to do while search:  looking for motif
  
  if (eof(IN)){ #print data for last seqID
               foreach $repeat(@locus){
            (print OUT $repeat )if(length $repeat != 0);
             (print OUT $len, "\n")if(length $repeat!= 0);
          }               
} 
}
close IN; 
close OUT;

# Remove repeated loci and merge loci in overlap region


open (INN, "<$seq.tmp");
open (OUT, ">$seq.temp2");

print OUT "ID\tSeq_length\tstart\tend\trep\ttype\n"; # Header 


my $value="";
my $k="";
my %info=();
my %infor=();

while ( <INN>){ # one line at at time
   chomp ;
   if ($_=~/^>.*/){
      (my $id,my $rcount,my $mstart,my $mend,my $mrep,my $mtype,my $Seq_len)=split("\t",);
       $value = join("\t", $id,$Seq_len,$mstart,$mend,$mrep,$mtype);
       $k = join("\$\$", $id,$mstart);
       
       if(! exists $info{$k}){
          $info{$k}=$mend; 
       }elsif($info{$k}<$mend){ 
       # to find far end in the right side of overlap region
            $info{$k}=$mend;
       }
             
       # hashing all information based on $k
                 if(! exists $infor{$k}){
             $infor{$k}=$value; 
         }
   } #end if
   
} #ending while readin

#output temporary results: 
     foreach my $kout(sort keys %info){
       print OUT $infor{$kout}, "\n"; 
     }
   %info=(); %infor=();
close INN;
close OUT;

open(IN,"<$seq.temp2");
open(OUT, ">$seq.temp3");

print OUT "id\tSeq_Length\tstart\tend\trep\ttype\n"; # header

while ( <IN>){ 
    chomp ;
    if ($_=~/^>.*/){
      (my $id, my $Seq_len, my $mstart,my $mend,my $mrep,my $mtype)=split("\t",);
       $value = $_;

       $k = join("\$\$", $id,$mend);       
       
       if(! exists $info{$k}){
          $info{$k}=$mstart; 
       }elsif($info{$k}>$mstart){ 
       
            $info{$k}=$mstart;
       }
             
      
                 if(! exists $infor{$k}){
             $infor{$k}=$value; 
         }
   } 
   
} 

     foreach my $kout(sort keys %info){
       print OUT $infor{$kout}, "\n"; 
     }


close IN;

close OUT;

open(INNN,"<$seq.temp3");
open(OT,">$seq.temp4");


while (<INNN>){

  chomp ;

  if($_ =~ /^\>.+/){ #skip header line
    my ($sid, $lens, $jstart, $jend, $jrep, $jtype)= split ("\t", $_);
    my $llen = length $jtype;
    
 if ( $llen eq 1 && $jrep >= $ml && $jstart > 0 ){

      print OT "$sid\t$lens\t$jstart\t$jend\t$jrep\t$jtype\n";

    }
    elsif($llen >1 && $jstart > 0){

     print OT "$sid\t$lens\t$jstart\t$jend\t$jrep\t$jtype\n"; 
    }


}

}

close INNN;

close OT;


# Statistics of microsatellites


open (IN, "<$seq.temp4");
open (STAT,">$out.ssr_statistics");

# variable define



my $reffreq_id="";
my $reffreq_sub="";
my $reffreq_len="";
my $reffreq_motif="";
my @a=();
my @s=();
my @u=();
my %slen=();


while (<IN>){  
    chomp ;
    if($_ =~ /^\>.+/){ #skip header line
      my @c=split("\t",$_);
      # get information of >ID (name), Sub_unit, and Sub_unit length 
      # and then do statistic analysis
        push (@a, $c[0]); #name of ID, ok
        if (!exists $slen{$c[0]}){
          $slen{$c[0]}=$c[1];
        }# get sequence length
        push (@s, $c[5]); # Sub_unit type, ok
        push (@u, length $c[5]); # Motif unit type 
        
    }else{
    next; 
    }
    
  } 

# Calculate frequency

  $reffreq_len = &calc_freq(\@u); #count mers occurence
  $reffreq_sub = &calc_freq(\@s); #count motif ocurrence
  $reffreq_motif = &calc_fre_gmotif($reffreq_sub); #count motif ocurrence, pair grouped
  $reffreq_id = &calc_freq(\@a); #count ocurrence of ID of sequence 

# output results
  
  
  #for table 1
  print STAT "Distribution of each motif unit in sequence\n";
  print STAT "Motif_unit\t Total\n";
  &val_ascend($reffreq_len,\*STAT); 
  print STAT "\n";
  
  #for table 2
  print STAT "Distribution of each repeat type\n";
  print STAT "Repeat\t Total\n";
  &val_ascend($reffreq_sub,\*STAT); 
  print STAT "\n"; 
  
  #for table 3
  print STAT "Distribution each group of repeat type\n";
  print STAT "Repeat_group\t Total\n";
  &val_ascend($reffreq_motif,\*STAT); 
  print STAT "\n";
  
  #for table 4
  print STAT "Per megabase frequency of repeats in each sequence\n";
  print STAT "SeqID\tTotal_Motifs\tSeqSize\tFrequency\(Motifs\/Mb\)" ,"\n";
  &val_ascend_mb($reffreq_id,\*STAT,\%slen);
  
#close and exit
  close   IN;
  close STAT;

open(INNNN,"<$seq.temp4");
open(OTT,">$out.ssr.txt");

my $ss ="SSR";
my $j =1; 
my $cnt =0;
print OTT "ID\tSeq_length\tSSR_type\tSSR\tSize\tStart\tEnd\n";




while (<INNNN>){

  chomp ;

    my ($sid, $lens, $jstart, $jend, $jrep, $jtype)= split ("\t", $_);
    my $llen = length $jtype;
    my $size = $llen * $jrep;
    if ($max_motif == 6){
        my $ssrtype= "";
        if ( $llen eq 1 ){

          $ssrtype= "mono";
          $cnt++;
        }
        elsif($llen eq 2 ){

          $ssrtype= "di";
          $cnt++;
        }
        elsif($llen eq 3 ){

          $ssrtype= "tri";
          $cnt++;
        }
        elsif($llen eq 4 ){

          $ssrtype= "tetra";
          $cnt++;
        }
        elsif($llen eq 5 ){

          $ssrtype= "penta";
          $cnt++;
        }
        elsif($llen eq 6 ){

          $ssrtype= "hexa";
          $cnt++;
        }

    print OTT "$sid\t$lens\t$ssrtype\t$jtype\t$size\t$jstart\t$jend\n"; 

    $j++;


    }

else{

    my $ssrtype= "p";
    
    $cnt++;
print OTT "$sid\t$lens\t$ssrtype$llen\t$jtype\t$jrep\t$jstart\t$jend\n"; 

$j++;
}

}
close INNNN;

close OTT;
# system ("perl filter.pl $seq.ssr_results.txt");
system ("sed -i -e 's/>//g' $out.ssr.txt");

unlink "$seq.tmp";
unlink "$seq.temp2";
unlink "$seq.temp3";
unlink "$seq.temp4";


print "\n Your Microsatellite results are stored in $out.ssr.txt and corresponding statistics are in $out.ssr_statistics\n\n";
print "\n Total number of SSR identified : $cnt\n\n";
print "\n Thankyou for using this tool.\n";
print "\n\tGood Luck!\n\n";
system("date");

my $datend = time;
print "\n Total time used: ".sprintf("%.2f",($datend-$datestart)/60).' mins.'."\n\n";


############## Sub Routines ########################33
  # routines for frequence calculation
  sub val_ascend(){ 
   
      my ($fref,$of)=@_;
      my %hash=%{$fref};
      my $total=0;
      my $occur=0;
      foreach  my $k(sort {$hash{$b} <=> $hash{$a}} keys %hash){
        print {$of} $k ,"\t", $hash{$k},"\n";
        $total =$hash{$k}+$total;
        $occur =$occur+1; 
      }
      
      #print out results
      print {$of} "Total Unit\tTotal Occurence\n";
      print {$of} $occur, "\t",$total,"\n";
    
    } #end sub

# sub routine for mega base 
  sub val_ascend_mb(){ 
 
  
  #variables
  my ($fref,$of,$slf)=@_;
  my %rhash=%{$fref};
  my $total=0;
  my $occur=0;
  my $ol=0;
  my %slu=%{$slf};
  
  
    foreach my $k(sort {$rhash{$b} <=> $rhash{$a}} keys %rhash){ 
       
        print {$of} $k ,"\t", $rhash{$k}, "\t", $slu{$k}, "\t", $rhash{$k}/$slu{$k}*1000000,"\n";
        $total =$rhash{$k}+$total;
        $occur =$occur+1; 
        $ol=$ol+$slu{$k}; 
          
    } 
  
 
  print {$of} "total_above", "\t","total_above","\t","total_above","\t", "average_frequency","\n";
  if($ol!=0){
    print {$of} $occur, "\t",$total,"\t",$ol,"\t", $total/$ol*1000000,"\n";}
} 

####################
 
# routine for occurence count
   sub calc_freq(){ 
      #definition
      my @cat=@{shift @_}; 
      my %allinfo=();
      my $word=" ";
    
      foreach $word (@cat){
          if(! exists $allinfo{$word}){
            $allinfo{$word}=1;
          }
          else{
            $allinfo{$word}++;}
      } 
      return \%allinfo;
    } 
# Claculate grouped motif Occurence
  sub calc_fre_gmotif(){ 

    my %hash=%{shift @_}; 
    my %c=();
    
    foreach  my $k( keys %hash){
     
      my $ktmp=$k;
      $ktmp=~tr/AGTC/TCAG/;
      my $k_cr=reverse $ktmp;
      my $pairk=$k."\/".$k_cr;
  
      if($k ne $k_cr){ 
        if(exists $hash{$k_cr}){     
          ( $c{$pairk}=$hash{$k_cr}+$hash{$k})if($hash{$k}!= -1); #get the paired value
          $hash{$k_cr}=-1;     
        }else{ 
          ( $c{$pairk}=$hash{$k})if($hash{$k}!= -1); 
        }
      }else{ 
        ($c{$pairk}=$hash{$k})if($hash{$k}!= -1); 
      }
      
    } 
    return \%c;
  } 
  
sub Usage{

          print <<"Usage End.";

          DESCRIPTION: 
                        Tool for identification of Simple Sequence Repeats in a genome sequence
                
           
           Usage:
                          $0 [options] ...
           Options:

                     -i    <str>       *Must be given. The sequence file in FASTA format.
                          
                     -min  <int>       The minimum length of repeat motif to be identified. [default: 1]

                     -max  <int>       The maximum length of repeat motif to be identified. [default: 6]

                     -ml   <int>       How many times a mono repeat motif should repeat. [default: 10]

                     -t    <int>       How many times a motif should repeat. [default: 5]
      
                     -sp   <str>       Species name to be included in output result files. [default: MicroSatMiner_results]

                     help              For help use help.

          
          For more information contact naveen.duhan[at].usu.edu. 


Usage End.
           exit;

}

